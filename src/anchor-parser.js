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

            this.ast = node;
            this.lookaheadToken = this.source.nextToken(); 
        } else {
            let inputTypeName       = tokenName(this.lookaheadToken.type),
                expectedTypeName    = tokenName(expectedType);
                
            throw Error('Expecting ' + expectedTypeName + ' type; found ' +
                        inputTypeName + ' type.'); 
        } 
    } 

    check(expectedType) {
        return (this.lookaheadToken.type === expectedType);
    }

    fragmentStart() {
        let tree;

        this.fragments();
        tree = this.ast;

        this.match(TokenEnum.EOL);
        this.ast = tree;
    }

    fragments() {
        this.fragment();
        
        while (this.check(TokenEnum.AMPERSAND)) {
            let tree = this.ast;

            this.match(TokenEnum.AMPERSAND);
            this.ast.addChild(tree);
            tree = this.ast;

            this.fragments();
            tree.addChild(this.ast);
            this.ast = tree;
        }
    }

    fragment() {
        let tree;

        this.match(TokenEnum.WORD); 
        tree = this.ast;

        this.match(TokenEnum.EQUALS); 
        this.ast.addChild(tree);
        tree = this.ast;

        this.match(TokenEnum.WORD); 
        tree.addChild(this.ast);
        this.ast = tree;

        while (this.check(TokenEnum.COLON)) {
            let tree = this.ast;

            this.match(TokenEnum.COLON);
            this.ast.addChild(tree);
            tree = this.ast;

            this.dependentParts();
            tree.addChild(this.ast);
            this.ast = tree;
        }
    }

    dependentParts() {
        let tree;

        this.match(TokenEnum.WORD); 
        tree = this.ast;

        this.match(TokenEnum.COMMA); 
        this.ast.addChild(tree);
        tree = this.ast;

        this.match(TokenEnum.WORD); 
        tree.addChild(this.ast);
        this.ast = tree;

        while (this.check(TokenEnum.VERTBAR)) {
            let tree = this.ast;

            this.match(TokenEnum.VERTBAR);
            this.ast.addChild(tree);
            tree = this.ast;

            this.dependentParts();
            tree.addChild(tree);
            this.ast = tree;
        }
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
            buffer +=  ' ' + node.lexeme();
            
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
    lexer   = new AnchorLexxer(complex),
    parser  = new AnchorParser(lexer);


parser.fragmentStart();
// console.log('ast is:', parser.ast);
// console.log(parser.ast);
console.log(prefixTraversal(parser.ast));
