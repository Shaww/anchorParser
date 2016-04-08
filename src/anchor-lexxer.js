import _u from 'underscore';


const COLON       = Symbol('Colon Token');
const VERTBAR     = Symbol('Vertical Bar Token');
const COMMA       = Symbol('Comma');
const EQUALS      = Symbol('Equals Token');
const AMPERSAND   = Symbol('Ampersands Token');
const WORD        = Symbol('Word Token');
const EOL         = Symbol('Terminating Token');


const tokenSymbols = [COLON, VERTBAR, COMMA, EQUALS, AMPERSAND, WORD, EOL];
const tokenNames   = ['COLON', 'VERTBAR', 'COMMA', 'EQUALS', 'AMPERSAND',  
                        'WORD', 'EOL'];


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
let TokenEnum = function() {
    let enumPairs = _u.zip(tokenNames, tokenSymbols);

    return new Map(enumPairs);
}();


let TokenNameMap = function() {
    let enumValues      = toList( TokenEnum.values() ),
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
    let type = TokenEnum.get(tokenId);

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
            return makeToken(TokenEnum.get('EOL'), '\0'); 
        }

        if (isAlphaNum.test(lookAhead)) {
            let search  = this.fragment.slice(this.cursor),
                matched = wordRegex.exec(search),
                found   = matched[0];

            this.cursor = this.cursor + found.length;
            token = makeToken(TokenEnum.get('WORD'), found);

        } else switch(lookAhead) {
            case ':':
                this.consume();
                token = makeToken(TokenEnum.get('COLON'), ':');
                break;

            case ',': 
                this.consume();
                token = makeToken(TokenEnum.get('COMMA'), ',');
                break;

            case '|':
                this.consume();
                token = makeToken(TokenEnum.get('VERTBAR'), '|');
                break;

            case '=':
                this.consume();
                token = makeToken(TokenEnum.get('EQUALS'), '=');
                break;

            case '&':
                this.consume();
                token = makeToken(TokenEnum.get('AMPERSAND'), '&')
                break;
            
            default:
                throw Error('Unknown character to be lexxed'); 
        }

        return token;
    }
}


export {TokenEnum, makeToken, tokenType, tokenName, AnchorLexxer};


// testing
// let input   = 'chat=profile:on:uid,green|other,yes',
//     lexxer  = new AnchorLexxer(input);

// let t = lexxer.nextToken();


// while (t.type !== TokenEnum.get('EOL')) {
//     console.log('type is:', TokenNameMap.get(t.type));
//     t = lexxer.nextToken()
// }

// console.log('type is:', TokenNameMap[t.type]);
// console.log('name of type `COLON` is:', tokenName(TokenEnum.COLON));
