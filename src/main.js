import {AnchorParser} from './anchor-parser';
import {AnchorLexxer} from './anchor-lexxer';
import {MapBuilderWalker} from './map-builder-walker';


// testing
let input   = 'chat=on:uid,suzie|color,green',
    simpleFrag      = 'chat=on',
    compoundFrag    = 'chat=on&profile=2', 
    incomplete      = 'chat',
    mixed           = 'chat=on:uid,suzie&profile=2',
    complex         = 'chat=on&profile=2&debug=false',
    mixedComplex    = 'chat=on:uid,suzie&profile=2&debug=false:priority,high',
    singleFull      = 'chat=on:uid,suzie|color,green|ts,02101999',
    compoundLexxer  = new AnchorLexxer(compoundFrag),
    compoundParser  = new AnchorParser(compoundLexxer),
    simpleLexxer    = new AnchorLexxer(simpleFrag),
    simpleParser    = new AnchorParser(simpleLexxer),
    singleLexxer    = new AnchorLexxer(singleFull),
    singleParser    = new AnchorParser(singleLexxer),
    complexLexxer   = new AnchorLexxer(mixedComplex),
    complexParser   = new AnchorParser(complexLexxer),
    walker;


singleParser.fragmentStart();
walker = new MapBuilderWalker(singleParser.asTree());
walker.walk();
console.log(walker.getMap());

compoundParser.fragmentStart();
walker = new MapBuilderWalker(compoundParser.asTree());
walker.walk();
console.log(walker.getMap());

complexParser.fragmentStart();
walker = new MapBuilderWalker(complexParser.asTree());
walker.walk();
console.log(walker.getMap());
