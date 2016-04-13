import _u from 'underscore';
import * as TokenTypes from './anchor-token-types';


let merge = (o1, o2) => {
    let merged = Object.create(null);

    _u.extend(merged, o1, o2);

    return merged;
};


// This tree walker takes the root of an homogeneous AST tree as its input. 
// Since the node are homogeneous, we will be dispatching on the node type.
//
// The walk will build up the map(key-val object literal) by merging the trees
// of the left and right branches.
class MapBuilderWalker {
    constructor(root) {
        this.root = root; 
        this.map  = Object.create(null);
    }  

    walk() {
        this.map = this.dispatch(this.root); 
    }

    getMap() {
        return this.map; 
    }

    dispatch(node) {
        let type = node.nodeType();

        switch(type) {
            case TokenTypes.AMPERSAND:
                 return this.walk_ampersand_node(node);
                break;

            case TokenTypes.COLON:
                 return this.walk_colon_node(node);
                break;

            case TokenTypes.VERTBAR:
                 return this.walk_verticalBar_node(node);
                break;

            case TokenTypes.COMMA:
                 return this.walk_comma_node(node);
                break;

            case TokenTypes.EQUALS:
                 return this.walk_equals_node(node);
                break;

            case TokenTypes.WORD:
                 return this.walk_word_node(node);
                break;

            default:
                throw Error('Encountered an invalid node whilst walking the tree');
        }
    }

    walk_ampersand_node(node) {
        let type        = node.nodeType(),
            leftTree    = node.children[0],
            rightTree   = node.children[1],
            mergedMappings;


        mergedMappings = merge( this.dispatch(leftTree), 
                                this.dispatch(rightTree) );

        return mergedMappings;
    }

    walk_colon_node(node) {
        let type            = node.nodeType(),
            map             = Object.create(null), 
            independentPart = node.children[0],
            dependentPart   = node.children[1],
            mergedMappings,
            independentMap,
            dependentMap,
            dependentWrap,
            independentMapKey,
            dependentMapKey;

        independentMap      = this.dispatch(independentPart);
        dependentMap        = this.dispatch(dependentPart);
        independentMapKey   = _u.keys(independentMap)[0];
        dependentMapKey     = '_' + independentMapKey;
        dependentWrap       = Object.create(null);

        dependentWrap[dependentMapKey] = dependentMap;

        mergedMappings = merge(independentMap, dependentWrap);

        return mergedMappings;
    }

    walk_verticalBar_node(node) {
        let type                    = node.nodeType(),
            map                     = Object.create(null),
            leftDependencies        = node.children[0],
            rightDependencies       = node.children[1],
            mergedMappings;

        mergedMappings = merge(this.dispatch(leftDependencies), 
                                this.dispatch(rightDependencies));

        return mergedMappings;
    }

    walk_comma_node(node) {
        let type = node.nodeType(),
            map  = Object.create(null),
            prop = node.children[0],
            val  = node.children[1];

        map[this.dispatch(prop)] = this.dispatch(val);

        return map;
    }

    walk_equals_node(node) {
        let type = node.nodeType(),
            map  = Object.create(null),
            prop = node.children[0],
            val  = node.children[1];

        map[this.dispatch(prop)] = this.dispatch(val);

        return map;
    }

    walk_word_node(node) {
        let type = node.nodeType();

        return node.lexeme();
    }
}


export {MapBuilderWalker};
