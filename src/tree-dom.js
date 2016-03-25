
import diff from 'js-tree-diff';

const _document = typeof document === 'undefined' ? {
	createElement: ()=> { throw new Error('Render library not defined.'); },
	createTextNode: ()=> { throw new Error('Render library not defined.'); }
} : document;

export const create = ( cb, library = _document )=> {
	var prevTree = null;
	const render = (  root, nextTree )=> {
		if ( prevTree === null ) {
			build( root, nextTree, library );
		}
		else {
			const patches = diff( prevTree, nextTree );
			patch( root, patches, library );
		}
		prevTree = nextTree;
	};
	cb( render );
};

const build = ( root, tree, library )=> {
	const insert = ( parent, node )=> {
		const { key, label, attrs, text, children } = node;
		if ( label !== 'text' ) {
			const elementNode = library.createElement( label );
			Object
				.keys( attrs )
				.forEach( attr =>
					elementNode.setAttribute( attr, attrs[attr] ));
			children
				.forEach( child =>
					insert( elementNode, child ));
			parent.appendChild( elementNode );
		}
		else {
			const textNode = library.createTextNode( text );
			parent.appendChild( textNode );
		}
	};
	insert( root, tree );
};

const patch = ( root, patches, library )=> {
	const find = ( base, path, key )=> {
		const getChild = ( parent, index )=> {
			return parent.childNodes[index];
		};
		if ( path.length !== 0 ) {
			const child = getChild( base, path[0] );
			return find( child, path.slice( 1 ), key );
		}
		return getChild( base, key );
	};
	
	patches.forEach( patch => {
		const { op, node, type, value } = patch;
		const { key, path } = node;
		const _node = find( root, path, key );
		
		switch ( op ) {
		case 'UPDATE':
			if ( type === 'text' )
				_node.textContent = value;
			return;
		}
	});
};
