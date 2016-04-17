import _u from 'underscore'
import * as TokenTypes from './anchor-token-types'


const tokenSymbols = [TokenTypes.COLON, TokenTypes.VERTBAR, TokenTypes.COMMA,
                      TokenTypes.EQUALS, TokenTypes.AMPERSAND, TokenTypes.WORD,
                      TokenTypes.EOL]

const tokenNames   = ['COLON', 'VERTBAR', 'COMMA', 'EQUALS', 'AMPERSAND',
                      'WORD', 'EOL']

// TokenEnum = {
//     COLON
//     VERTBAR
//     COMMA
//     EQUALS
//     AMPERSAND
//     WORD
//     EOL
// }

// string id to token symbol assocation.
function tokenEnumMap () {
  let enumPairs       = _u.zip(tokenNames, tokenSymbols)

  return new Map(enumPairs)
}

let TokenEnumMap = tokenEnumMap()


// token symbol to string representation assocation.
function tokenNameMap () {
  let enumNamePairs   = _u.zip(tokenSymbols, tokenNames)

  return new Map(enumNamePairs)
}

let TokenNameMap = tokenNameMap()


let tokenType = (tokenId) => {
  let type = TokenEnumMap.get(tokenId)

  return (type === undefined) ? null : type
}


let tokenName = (tokenType) => {
  let name = TokenNameMap.get(tokenType)

  return (name === undefined) ? null : name
}


export {TokenEnumMap, TokenNameMap, tokenType, tokenName}
