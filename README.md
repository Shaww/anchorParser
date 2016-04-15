Lexer and parser to recognize a simple URL anchor fragment language based on 
grammar found in the jQuery plugin: https://github.com/mmikowski/urianchor.

    Example of anchor fragments:

    'chat=on:uid,suzie|status,green'
        
        could be interpreted as....

    map = {
        chat        : 'on',
        _chat       : {
            uid     : 'suzie', 
            status  : 'green'
        }
    }

    'chat=on&profile=2'

        could be interpreted as....

    map = {
        chat    : 'on',
        profile : '2'
    }


The following is the grammar. It can be parsed using an LL(1) parser.

    <fragments`>        := <fragments><EOL>
    <fragments>         := <fragment> | <fragment> '&' <fragments> 
    <fragment>          := <independentPart> | <independentPart> ':' <dependentParts>
    <independentPart>   := <literal> '=' <literal>
    <dependentParts>    := <dependentPair> | <dependentPair> '|' <dependentParts>
    <dependentPair>     := <literal> ',' <literal>
    <literal>           := [a-zA-Z0-9]+
    <EOL>               := '\0'
