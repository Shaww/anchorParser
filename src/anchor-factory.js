import {AnchorParser} from './anchor-parser';
import {AnchorLexxer} from './anchor-lexxer';
import * as TokenTypes from './anchor-token-types';


let createAnchorLexer = () => {
    return AnchorLexxer;
}


let createAnchorParser = () => {
    return AnchorParser;
}


let getTokenTypes = () => {
  return TokenTypes;
}


class AnchorFactory {
    createLexer() {
        return createAnchorLexer(); 
    }

    createParser() {
        return createAnchorParser(); 
    }

    getTypes() {
        return getTokenTypes();
    }
};


export {AnchorFactory};  
