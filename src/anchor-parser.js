import {AnchorLexxer, TokenEnum, tokenName} from './anchor-lexxer';


class AnchorParser {
    constructor(source) {
        this.source = source; 
        this.lookaheadToken = source.nextToken();
    }

    match(expectedType) {
        if (this.lookaheadToken.type === expectedType) {
            console.log('matched: ' + tokenName(expectedType) + ' => ' + this.lookaheadToken.lexeme);
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
        this.fragments();
        this.match(TokenEnum.EOL);
    }

    fragments() {
        this.fragment();
        
        while (this.check(TokenEnum.AMPERSAND)) {
            this.match(TokenEnum.AMPERSAND);
            this.fragments();
        }
    }

    fragment() {
        this.match(TokenEnum.WORD); 
        this.match(TokenEnum.EQUALS); 
        this.match(TokenEnum.WORD); 

        while (this.check(TokenEnum.COLON)) {
            this.match(TokenEnum.COLON);
            this.dependentParts();
        }
    }

    dependentParts() {
        this.match(TokenEnum.WORD); 
        this.match(TokenEnum.COMMA); 
        this.match(TokenEnum.WORD); 

        while (this.check(TokenEnum.VERTBAR)) {
            this.match(TokenEnum.VERTBAR);
            this.dependentParts();
        }
    }
}


// testing
let input   = 'chat=on:uid,suzie|color,green',
    simpleFrag      = 'chat=on',
    compoundFrag    = 'chat=on&profile=2', 
    incomplete      = 'chat',
    lexer   = new AnchorLexxer(incomplete),
    parser  = new AnchorParser(lexer);


parser.fragmentStart();


