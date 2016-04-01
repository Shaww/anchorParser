let TokenEnum = {
    COLON   : 1,
    VERTBAR : 2,
    COMMA   : 3,
    EQUALS  : 4,
    WORD    : 5,
    EOL     : 6
};


let makeToken = (type, lexeme) => {
    let token = Object.create(null);

    token.type = type; 
    token.lexeme = lexeme;

    return token
}


class AnchorLexxer {
    constructor(urlFragment) {
        this.fragment   = urlFragment; 
        this.len        = urlFragment.length;
        this.cursor     = 0;
        this.char       = undefined;

        this.char       = urlFragment[this.cursor];
    }

    nextToken() {
        let isAlpha = /[a-zA-Z]/,
            word    = /[a-zA-Z0-9]*/;

        if (this.cursor >= this.len) { 
            return makeToken(TokenEnum.EOL, '\0'); 
        }

        if (isAlpha.test(this.char)) {
            let token, 
                search  = this.fragment.slice(this.cursor),
                matched = word.exec(search),
                found   = matched[0];

            token = makeToken(TokenEnum.WORD, found);
            this.cursor = this.cursor + found.length;

            return token;

        } else if (this.char === ':') {
            let token;

            this.cursor += 1; 
            token = makeToken(TokenEnum.COLON, ':');

            return token;
        } else if (this.char === ',' ) {
            let token;

            this.cursor += 1; 
            token = makeToken(TokenEnum.COMMA, ',');

            return token;
        }
    }
}


// testing
let input   = 'chat=profile:on:uid,green',
    lexxer  = new AnchorLexxer(input),
    t       = lexxer.nextToken(); 

console.log('t is:', t);
