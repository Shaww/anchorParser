Lexer and parser to recognize a simple URL anchor fragment language.

Example of anchor fragment:
    '#chat=profile:on:uid,suzie|status,green'

        expands out to the following

    map = {
        profile     : 'on',
        _profile    : {
            uid     : 'suzie', 
            status  : 'green'
        }
    }

There is a concept of a independent key and its dependent context.

<fragments`>        := <fragments>'#!'   
<fragments>         := <fragment> | <fragment> <fragments> 
<fragment>          := <literal> '=' <content>
<content>           := <independentPart> | <independentPart> ':' <dependentPart>
<independentPart>   := <literal> ':' <literal>
<dependentPart>     := <dependentPairs>
<dependentPairs>    := <dependentPair> | <dependentPair> '|' <dependentPairs>
<dependentPair>     := <literal> ',' <literal>
<literal>           := [a-zA-Z0-9]+


Some types that can be seen include the punctuations: 
    ':'(for both the independent key/value split and to signalling beginning of 
       dependent part). 

    '|'(key/value separator found in the dependent part).

    ','(key value separator for the dependent pairs).

    '#!'(signalling the end of the fragment).


literal matching can be done with regex. /[a-zA-Z0-9]+/ sufficient? 
