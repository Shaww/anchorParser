Lexer and parser to recognize a simple URL anchor fragment language.

Example of anchor fragment:
    '#chat=on:uid,suzie|status,green'

        expands out to the following

    map = {
        chat        : 'on',
        _chat       : {
            uid     : 'suzie', 
            status  : 'green'
        }
    }

    '#chat=on&profile=2'

        expands to

    map = {
        chat    : 'on',
        profile : '2'
    }


There is a concept of a independent key and its dependent context.

<fragments`>        := <fragments><EOL>
<fragments>         := <fragment> | <fragment> '&' <fragments> 
<fragment>          := <independentPart> | <independentPart> ':' <dependentParts>
<independentPart>   := <literal> '=' <literal>
<dependentParts>    := <dependentPair> | <dependentPair> '|' <dependentParts>
<dependentPair>     := <literal> ',' <literal>
<literal>           := [a-zA-Z0-9]+
<EOL>               := '\0'


Some types that can be seen include the punctuations: 
    ':'(for both the independent key/value split and to signalling beginning of 
       dependent part). 

    '|'(key/value separator found in the dependent part).

    ','(key value separator for the dependent pairs).

    '#!'(signalling the end of the fragment).


literal matching can be done with regex. /[a-zA-Z0-9]+/ sufficient? 
