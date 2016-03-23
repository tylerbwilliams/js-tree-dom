'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.create = undefined;

var _jsTreeDiff = require('js-tree-diff');

var _jsTreeDiff2 = _interopRequireDefault(_jsTreeDiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var create = exports.create = function create(cb) {
	var _document = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];

	var prevTree = null;
	var render = function render(root, nextTree) {
		if (prevTree === null) {
			build(root, nextTree, _document);
		} else {
			var patches = (0, _jsTreeDiff2.default)(prevTree, nextTree);
			patch(root, patches, _document);
		}
		prevTree = nextTree;
	};
	cb(render);
};

var build = function build(root, tree, _document) {
	var insert = function insert(parent, node) {
		var key = node.key;
		var label = node.label;
		var attrs = node.attrs;
		var text = node.text;
		var children = node.children;

		if (label !== 'text') {
			(function () {
				var elementNode = _document.createElement(label);
				Object.keys(attrs).forEach(function (attr) {
					return elementNode.setAttribute(attr, attrs[attr]);
				});
				children.forEach(function (child) {
					return insert(elementNode, child);
				});
				parent.appendChild(elementNode);
			})();
		} else {
			var textNode = _document.createTextNode(text);
			parent.appendChild(textNode);
		}
	};
	insert(root, tree);
};

var patch = function patch(root, patches, _document) {
	var find = function find(base, path, key) {
		var getChild = function getChild(parent, index) {
			return parent.childNodes[index];
		};
		if (path.length !== 0) {
			var child = getChild(base, path[0]);
			return find(child, path.slice(1), key);
		}
		return getChild(base, key);
	};

	patches.forEach(function (patch) {
		var op = patch.op;
		var node = patch.node;
		var type = patch.type;
		var value = patch.value;
		var key = node.key;
		var path = node.path;

		var _node = find(root, path, key);

		switch (op) {
			case 'UPDATE':
				if (type === 'text') _node.textContent = value;
				return;
		}
	});
};