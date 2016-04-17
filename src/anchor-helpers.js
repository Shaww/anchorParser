import _u from 'underscore'
import * as TokenTypes from './anchor-token-types'


const tokenSymbols = [TokenTypes.COLON, TokenTypes.VERTBAR, TokenTypes.COMMA, 
                      TokenTypes.EQUALS, TokenTypes.AMPERSAND, TokenTypes.WORD, 
                      TokenTypes.EOL];

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
let TokenEnumMap = function () {
  let enumPairs       = _u.zip(tokenNames, tokenSymbols);

  return new Map(enumPairs);
}();


// token symbol to string representation assocation.
let TokenNameMap = function () {
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
