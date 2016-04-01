import _u from 'underscore';


let TokenEnum = {
    COLON   : 1,
    VERTBAR : 2,
    COMMA   : 3,
    EQUALS  : 4,
    WORD    : 5,
    EOL     : 6
};


let TokenNameMap = function() {
    let tokenNames      = ['COLON', 'VERTBAR', 'COMMA', 'EQUALS', 'WORD', 'EOL'],
        sortedEnums     = _u.values(TokenEnum).sort((a, b) => a - b),
        enumNamePairs   = _u.zip(sortedEnums, tokenNames);

    return _u.reduceRight(enumNamePairs, (memo, [enumType, enumName]) => {
        memo[enumType] = enumName;

        return memo;
    }, {});
}();
    

let makeToken = (type, lexeme) => {
    let token = Object.create(null);

    token.type = type; 
    token.lexeme = lexeme;

    return token
};


class AnchorLexxer {
    constructor(urlFragment) {
        this.fragment   = urlFragment; 
        this.len        = urlFragment.length;
        this.cursor     = 0;
        this.char       = undefined;
    }

    nextToken() {
        let lookAhead,
            token,
            isAlpha     = /[a-zA-Z]/,
            wordRegex   = /[a-zA-Z0-9]*/;

        lookAhead = this.char = this.fragment[this.cursor];

        if (this.cursor >= this.len) { 
            return makeToken(TokenEnum.EOL, '\0'); 
        }

        if (isAlpha.test(lookAhead)) {
            let token, 
                search  = this.fragment.slice(this.cursor),
                matched = wordRegex.exec(search),
                found   = matched[0];

            token = makeToken(TokenEnum.WORD, found);
            this.cursor = this.cursor + found.length;

            return token;

        } else switch(lookAhead) {
            case ':':
                this.cursor += 1;
                token = makeToken(TokenEnum.COLON, ':');
                break;

            case ',': 
                this.cursor += 1;
                token = makeToken(TokenEnum.COMMA, ',');
                break;

            case '|':
                this.cursor += 1;
                token = makeToken(TokenEnum.VERTBAR, '|');
                break;

            case '=':
                this.cursor += 1;
                token = makeToken(TokenEnum.EQUALS, '=');
                break;
            
            default:
                throw Error('Unknown character to be lexxed'); 
        }

        return token;
    }
}


// testing
let input   = 'chat=profile:on:uid,green|other,yes',
    lexxer  = new AnchorLexxer(input);

let t = lexxer.nextToken();

while (t.type != TokenEnum.EOL) {
    console.log('type is:', TokenNameMap[t.type]);
    t = lexxer.nextToken()
}

console.log('type is:', TokenNameMap[t.type]);
