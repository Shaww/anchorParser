import * as TokenTypes from './anchor-token-types';
import {tokenName} from './anchor-helpers';


// bare-bones representation of a token, an object literal with the type and 
// its bounded lexeme content.
let makeToken = (type, lexeme) => {
  let token = Object.create(null);

  token.type = type; 
  token.lexeme = lexeme;

  return token;
};


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

  // note that the definition of a `word` is loose, it can start with a numeric
  // value, so '7=some_rhs_value' is permissible and roughly translates to the
  // entry {'7': 'some_rhs_value', ...} in key-value object map, and is valid
  // in js.
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


export {makeToken, AnchorLexxer};

// testing
// let input   = 'chat=profile=on:uid,green|other,yes',
//     lexxer  = new AnchorLexxer(input);

// let t = lexxer.nextToken();

// while (t.type !== TokenTypes.EOL) {
//   console.log('type is:', tokenName(t.type));
//   t = lexxer.nextToken()
// }
