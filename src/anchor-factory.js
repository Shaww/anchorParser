import {AnchorParser} from './anchor-parser';
import {AnchorLexxer} from './anchor-lexxer';
import * as TokenTypes from './anchor-token-types';


let createAnchorLexer = () => {
    return AnchorLexxer;
}


let createAnchorParser = () => {
    return AnchorParser;
}


class AnchorFactory {
    createLexer() {
        return createAnchorLexer(); 
    }

    createParser() {
        return createAnchorParser(); 
    }

    getTokenTypes() {
        return TokenTypes;
    }
};


export {AnchorFactory, createAnchorParser, createAnchorLexer};  
