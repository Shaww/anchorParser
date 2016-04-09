import _u from 'underscore';
import * as TokenTypes from './anchor-token-types';


let toList = (iterable) => {
    let list = [];

    for (let next of iterable) {
        list.push(next); 
    }

    return list;
}

// let TokenEnum = {
//     COLON       : 1,
//     VERTBAR     : 2,
//     COMMA       : 3,
//     EQUALS      : 4,
//     AMPERSAND   : 5, 
//     WORD        : 6,
//     EOL         : 7
// };
let TokenEnumMap = function() {
    let tokenNames      = TokenTypes.tokenNames, 
        tokenSymbols    = TokenTypes.tokenSymbols,
        enumPairs       = _u.zip(tokenNames, tokenSymbols);

    return new Map(enumPairs);
}();


let TokenNameMap = function() {
    let tokenNames      = TokenTypes.tokenNames, 
        tokenSymbols    = TokenTypes.tokenSymbols,
        enumValues      = toList( TokenEnumMap.values() ),
        enumNamePairs   = _u.zip(enumValues, tokenNames);

    return new Map(enumNamePairs);
}();


let makeToken = (type, lexeme) => {
    let token = Object.create(null);

    token.type = type; 
    token.lexeme = lexeme;

    return token;
};


let tokenType = (tokenId) => {
    let type = TokenEnumMap.get(tokenId);

    return (type === undefined) ? null : type;
}


let tokenName = (tokenType) => {
    let name = TokenNameMap.get(tokenType);

    return (name === undefined) ? null : name;
}


class AnchorLexxer {
    constructor(hashFragment) {
        this.fragment   = hashFragment; 
        this.len        = hashFragment.length;
        this.cursor     = 0;
        this.char       = undefined;
    }

    consume() {
        this.cursor += 1; 
    }

    nextToken() {
        let lookAhead,
            token,
            isAlphaNum  = /[a-zA-Z0-9]/,
            wordRegex   = /[a-zA-Z0-9]*/;

        lookAhead = this.char = this.fragment[this.cursor];

        if (this.cursor >= this.len) { 
            return makeToken(TokenTypes.EOL, '\0'); 
        }

        if (isAlphaNum.test(lookAhead)) {
            let search  = this.fragment.slice(this.cursor),
                matched = wordRegex.exec(search),
                found   = matched[0];

            this.cursor = this.cursor + found.length;
            token = makeToken(TokenTypes.WORD, found);

        } else switch(lookAhead) {
            case ':':
                this.consume();
                token = makeToken(TokenTypes.COLON, ':');
                break;

            case ',': 
                this.consume();
                token = makeToken(TokenTypes.COMMA, ',');
                break;

            case '|':
                this.consume();
                token = makeToken(TokenTypes.VERTBAR, '|');
                break;

            case '=':
                this.consume();
                token = makeToken(TokenTypes.EQUALS, '=');
                break;

            case '&':
                this.consume();
                token = makeToken(TokenTypes.AMPERSAND, '&');
                break;
            
            default:
                throw Error('Unknown character to be lexxed'); 
        }

        return token;
    }
}


export {TokenEnumMap, TokenNameMap, makeToken, tokenType, tokenName, AnchorLexxer};


// testing
// let input   = 'chat=profile:on:uid,green|other,yes',
//     lexxer  = new AnchorLexxer(input);

// let t = lexxer.nextToken();

// while (t.type !== TokenTypes.EOL) {
//     console.log('type is:', TokenNameMap.get(t.type));
//     t = lexxer.nextToken()
// }

// console.log('type is:', TokenNameMap[t.type]);
// console.log('name of type `COLON` is:', tokenName(TokenEnum.COLON));
