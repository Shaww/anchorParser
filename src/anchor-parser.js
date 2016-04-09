import _u from 'underscore';
import * as TokenTypes from './anchor-token-types';
import {AnchorLexxer, tokenType, tokenName} from './anchor-lexxer';


let merge = (o1, o2) => {
    let merged = Object.create(null);

    _u.extend(merged, o1, o2);

    return merged;
};


class MapBuilderWalker {
    constructor(root) {
        this.root = root; 
        this.map  = Object.create(null);
    }  

    walk() {
        this.map = this.dispatch(this.root); 
    }

    getMap() {
        return this.map; 
    }

    dispatch(node) {
        let type = node.nodeType();

        switch(type) {
            case TokenTypes.AMPERSAND:
                 return this.walk_ampersand_node(node);
                break;

            case TokenTypes.COLON:
                 return this.walk_colon_node(node);
                break;

            case TokenTypes.VERTBAR:
                 return this.walk_verticalBar_node(node);
                break;

            case TokenTypes.COMMA:
                 return this.walk_comma_node(node);
                break;

            case TokenTypes.EQUALS:
                 return this.walk_equals_node(node);
                break;

            case TokenTypes.WORD:
                 return this.walk_word_node(node);
                break;

            default:
                throw Error('Encountered an invalid node whilst walking the tree');
        }
    }


    walk_ampersand_node(node) {
        let type        = node.nodeType(),
            leftTree    = node.children[0],
            rightTree   = node.children[1],
            mergedMappings;


        mergedMappings = merge( this.dispatch(leftTree), 
                                this.dispatch(rightTree) );

        return mergedMappings;
    }

    walk_colon_node(node) {
        let type            = node.nodeType(),
            map             = Object.create(null), 
            independentPart = node.children[0],
            dependentPart   = node.children[1],
            mergedMappings,
            independentMap,
            dependentMap,
            dependentWrap,
            independentMapKey,
            dependentMapKey;

        independentMap      = this.dispatch(independentPart);
        dependentMap        = this.dispatch(dependentPart);
        independentMapKey   = _u.keys(independentMap)[0];
        dependentMapKey     = '_' + independentMapKey;
        dependentWrap       = Object.create(null);

        dependentWrap[dependentMapKey] = dependentMap;

        mergedMappings = merge(independentMap, dependentWrap);

        return mergedMappings;
    }

    walk_verticalBar_node(node) {
        let type                    = node.nodeType(),
            map                     = Object.create(null),
            leftDependencies        = node.children[0],
            rightDependencies       = node.children[1],
            mergedMappings;

        mergedMappings = merge(this.dispatch(leftDependencies), 
                                this.dispatch(rightDependencies));

        return mergedMappings;

    }

    walk_comma_node(node) {
        let type = node.nodeType(),
            map  = Object.create(null),
            prop = node.children[0],
            val  = node.children[1];

        map[this.dispatch(prop)] = this.dispatch(val);

        return map;
    }

    walk_equals_node(node) {
        let type = node.nodeType(),
            map  = Object.create(null),
            prop = node.children[0],
            val  = node.children[1];

        map[this.dispatch(prop)] = this.dispatch(val);

        return map;
    }

    walk_word_node(node) {
        let type = node.nodeType();

        return node.lexeme();
    }
}


class AST {
    constructor(token) {
        this.token      = token;    
        this.children   = [];
    }

    nodeType() {
        return this.token.type; 
    }

    lexeme() {
        return this.token.lexeme; 
    }

    addChild(ast) {
        if (this.children === null) {
            this.children = [];
        }

        this.children.push(ast);
    }
}


class AnchorParser {
    constructor(source) {
        this.source = source; 
        this.lookaheadToken = source.nextToken();
        this.ast            = null;
    }

    match(expectedType) {
        if (this.lookaheadToken.type === expectedType) {
            let node = new AST(this.lookaheadToken);

            // advance to next token
            this.lookaheadToken = this.source.nextToken(); 

            return node;
        } else {
            let inputTypeName     = tokenName(this.lookaheadToken.type),
                expectedTypeName  = tokenName(expectedType);
                
            this.ast = null;

            throw Error('Expecting ' + expectedTypeName + ' type; found ' +
                        inputTypeName + ' type.'); 
        } 
    } 

    check(expectedType) {
        return (this.lookaheadToken.type === expectedType);
    }

    asTree() {
        return this.ast; 
    }

    fragmentStart() {
        let ast;

        ast = this.fragments();
        this.match( TokenTypes.EOL );

        this.ast = ast;
        return ast;
    }

    fragments() {
        let singleContext;

        singleContext = this.fragment();
        
        while (this.check( TokenTypes.AMPERSAND )) {
            let ampersandNode, additionalContextSubtree;

            ampersandNode               = this.match( TokenTypes.AMPERSAND );
            additionalContextSubtree    = this.fragments();

            ampersandNode.addChild(singleContext);
            ampersandNode.addChild(additionalContextSubtree);

            return ampersandNode;
        }

        return singleContext;
    }

    fragment() {
        let assignNode, leftOperand, rightOperand;

        leftOperand     = this.match( TokenTypes.WORD ); 
        assignNode      = this.match( TokenTypes.EQUALS ); 
        rightOperand    = this.match( TokenTypes.WORD ); 

        assignNode.addChild(leftOperand);
        assignNode.addChild(rightOperand)

        if  (this.check( TokenTypes.COLON )) {
            let colonNode, dependentSubtree;

            colonNode           = this.match( TokenTypes.COLON );
            dependentSubtree    = this.dependentParts();

            colonNode.addChild(assignNode);
            colonNode.addChild(dependentSubtree);

            // there is a dependent part, so the colon node(the separtator) 
            // becomes the new local root, with the assignment subtree being
            // it's left child.
            return colonNode;
        }

        // assignment node is the local root;
        return assignNode;
    }

    dependentParts() {
        let keyNode, valueNode, commaNode;

        keyNode     = this.match( TokenTypes.WORD ); 
        commaNode   = this.match( TokenTypes.COMMA ); 
        valueNode   = this.match( TokenTypes.WORD ); 

        commaNode.addChild(keyNode);
        commaNode.addChild(valueNode);

        while (this.check( TokenTypes.VERTBAR )) {
            let verticalbarNode, dependentSubtree;

            verticalbarNode     = this.match( TokenTypes.VERTBAR );
            dependentSubtree    = this.dependentParts();

            verticalbarNode.addChild(commaNode);
            verticalbarNode.addChild(dependentSubtree);

            return verticalbarNode;
        }

        return commaNode;
    }
}


let prefixTraversal = (root) => {
    let toVisit         = [],
        buffer          = '';

    toVisit.push(root);
    
    while (toVisit.length > 0) {
        let node    = toVisit.pop(),
            isLeaf  = node.children.length === 0;
        
        if (node.alreadyVisited !== undefined && node.alreadyVisited) {
            buffer += ')';
            delete node.alreadyVisited;

        } else if (isLeaf) {
            buffer += ' ' + node.lexeme();
            
        } else {
            let lastIndex       = node.children.length - 1, 
                lastChild       = node.children.slice(lastIndex)[0];
            
            buffer += '(' + node.lexeme() + ' ';

            node.alreadyVisited = true;
            toVisit.push(node);

            for (let child of node.children.reverse()) {
                toVisit.push(child); 
            }
        }
    }

    return buffer;
}

// testing
let input   = 'chat=on:uid,suzie|color,green',
    simpleFrag      = 'chat=on',
    compoundFrag    = 'chat=on&profile=2', 
    incomplete      = 'chat',
    mixed           = 'chat=on:uid,suzie&profile=2',
    complex         = 'chat=on&profile=2&debug=false',
    mixedComplex    = 'chat=on:uid,suzie&profile=2&debug=false:priority,high',
    singleFull      = 'chat=on:uid,suzie|color,green|ts,02101999',
    lexer           = new AnchorLexxer(mixedComplex),
    parser          = new AnchorParser(lexer),
    compoundLexxer  = new AnchorLexxer(compoundFrag),
    compoundParser  = new AnchorParser(compoundLexxer),
    simpleLexxer    = new AnchorLexxer(simpleFrag),
    simpleParser    = new AnchorParser(simpleLexxer),
    singleLexxer    = new AnchorLexxer(singleFull),
    singleParser    = new AnchorParser(singleLexxer),
    complexLexxer   = new AnchorLexxer(mixedComplex),
    complexParser   = new AnchorParser(complexLexxer),
    walker;


// parser.fragmentStart();
// console.log('ast is:', parser.ast);
// // console.log(parser.ast);
// console.log(prefixTraversal(parser.ast));

// singleParser.fragmentStart();
// walker = new MapBuilderWalker(singleParser.asTree());

// compoundParser.fragmentStart();
// walker = new MapBuilderWalker(compoundParser.asTree());

complexParser.fragmentStart();
walker = new MapBuilderWalker(complexParser.asTree());
walker.walk();

console.log(walker.getMap());

// console.log('compound parser', compoundParser.ast);
// console.log(compoundParser.asTree().nodeType());
