import _u from 'underscore';


export const COLON       = Symbol('Colon Token');
export const VERTBAR     = Symbol('Vertical Bar Token');
export const COMMA       = Symbol('Comma');
export const EQUALS      = Symbol('Equals Token');
export const AMPERSAND   = Symbol('Ampersands Token');
export const WORD        = Symbol('Word Token');
export const EOL         = Symbol('Terminating Token');


const tokenSymbols = [COLON, VERTBAR, COMMA, EQUALS, AMPERSAND, WORD, EOL];
const tokenNames   = ['COLON', 'VERTBAR', 'COMMA', 'EQUALS', 'AMPERSAND',  
                                'WORD', 'EOL'];

// TokenEnum = {
//     COLON       
//     VERTBAR     
//     COMMA       
//     EQUALS      
//     AMPERSAND    
//     WORD        
//     EOL         
// };

// string id to token symbol assocation.
let TokenEnumMap = function() {
    let enumPairs       = _u.zip(tokenNames, tokenSymbols);

    return new Map(enumPairs);
}();


// token symbol to string representation assocation.
let TokenNameMap = function() {
    let enumNamePairs   = _u.zip(tokenSymbols, tokenNames);

    return new Map(enumNamePairs);
}();


let tokenType = (tokenId) => {
    let type = TokenEnumMap.get(tokenId);

    return (type === undefined) ? null : type;
}


let tokenName = (tokenType) => {
    let name = TokenNameMap.get(tokenType);

    return (name === undefined) ? null : name;
}

export {TokenEnumMap, TokenNameMap, tokenType, tokenName};
