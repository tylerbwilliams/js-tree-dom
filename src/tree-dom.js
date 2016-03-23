
import diff from 'js-tree-diff';

export const create = ( cb, _document = document )=> {
	var prevTree = null;
	const render = (  root, nextTree )=> {
		if ( prevTree === null ) {
			build( root, nextTree, _document );
		}
		else {
			const patches = diff( prevTree, nextTree );
			patch( root, patches, _document );
		}
		prevTree = nextTree;
	};
	cb( render );
};

const build = ( root, tree, _document )=> {
	const insert = ( parent, node )=> {
		const { key, label, attrs, text, children } = node;
		if ( label !== 'text' ) {
			const elementNode = _document.createElement( label );
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
			const textNode = _document.createTextNode( text );
			parent.appendChild( textNode );
		}
	};
	insert( root, tree );
};

const patch = ( root, patches, _document )=> {
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
