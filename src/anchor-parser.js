import {AnchorLexxer, TokenEnum, tokenName} from './anchor-lexxer';


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
        this.match(TokenEnum.EOL);

        this.ast = ast;
        return ast;
    }

    fragments() {
        let singleContext;

        singleContext = this.fragment();
        
        while (this.check(TokenEnum.AMPERSAND)) {
            let ampersandNode, additionalContextSubtree;

            ampersandNode               = this.match(TokenEnum.AMPERSAND);
            additionalContextSubtree    = this.fragments();

            ampersandNode.addChild(singleContext);
            ampersandNode.addChild(additionalContextSubtree);

            return ampersandNode;
        }

        return singleContext;
    }

    fragment() {
        let assignNode, leftOperand, rightOperand;

        leftOperand     = this.match(TokenEnum.WORD); 
        assignNode      = this.match(TokenEnum.EQUALS); 
        rightOperand    = this.match(TokenEnum.WORD); 

        assignNode.addChild(leftOperand);
        assignNode.addChild(rightOperand)

        if  (this.check(TokenEnum.COLON)) {
            let colonNode, dependentSubtree;

            colonNode           = this.match(TokenEnum.COLON);
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

        keyNode     = this.match(TokenEnum.WORD); 
        commaNode   = this.match(TokenEnum.COMMA); 
        valueNode   = this.match(TokenEnum.WORD); 

        commaNode.addChild(keyNode);
        commaNode.addChild(valueNode);

        while (this.check(TokenEnum.VERTBAR)) {
            let verticalbarNode, dependentSubtree;

            verticalbarNode     = this.match(TokenEnum.VERTBAR);
            dependentSubtree    = this.dependentParts();

            verticalbarNode.addChild(commanNode);
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
    lexer   = new AnchorLexxer(mixedComplex),
    parser  = new AnchorParser(lexer);


parser.fragmentStart();
console.log('ast is:', parser.ast);
// console.log(parser.ast);
console.log(prefixTraversal(parser.ast));
