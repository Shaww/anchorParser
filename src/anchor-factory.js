import {AnchorParser} from './anchor-parser';
import {AnchorLexxer} from './anchor-lexxer';

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
};


export {AnchorFactory, createAnchorParser, createAnchorLexer};  
