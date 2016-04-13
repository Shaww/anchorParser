Lexer and parser to recognize a simple URL anchor fragment language based on 
grammar found in the jQuery plugin: https://github.com/mmikowski/urianchor.

    Example of anchor fragment:

    'chat=on:uid,suzie|status,green'

        expands out to the following

    map = {
        chat        : 'on',
        _chat       : {
            uid     : 'suzie', 
            status  : 'green'
        }
    }

    'chat=on&profile=2'

        expands to

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
