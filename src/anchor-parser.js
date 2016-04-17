import * as TokenTypes from './anchor-token-types';
import {AnchorLexxer} from './anchor-lexxer';


// a homogeneous AST node/tree
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
      let inputTypeName     = TokenTypes.tokenName(this.lookaheadToken.type),
      expectedTypeName  = TokenTypes.tokenName(expectedType);

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

  // <fragments`> := <fragments><EOL>
  fragmentStart() {
    let ast;

    ast = this.fragments();
    this.match( TokenTypes.EOL );

    this.ast = ast;
    return ast;
  }

  // <fragments> := <fragment> | <fragment> '&' <fragments> 
  // <fragments> := <fragment> ( '&' <fragments> )?
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

  // <fragment> := <independentPart> | <independentPart> ':' <dependentParts>
  // <fragment> := <independentPart> ( ':' <dependentParts> )?
  //
  // <independentPart>    := <literal> '=' <literal>
  //
  // <literal>            := [a-zA-Z0-9]+
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

        // there is a dependent part, so the colon node(the separator) 
        // becomes the new local root, with the assignNode subtree becoming
        // it's left child.
        return colonNode;
      }

      // assignment node is the local root;
      return assignNode;
    }

    // <dependentParts> := <dependentPair> | <dependentPair> '|' <dependentParts>
    // <dependentParts> := <dependentPair> ( '|' <dependentParts> )?
    //
    // <dependentPair>      := <literal> ',' <literal>
    //
    // <literal>            := [a-zA-Z0-9]+
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

export {AnchorParser};
