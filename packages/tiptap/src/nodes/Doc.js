import Node from '../Utils/Node'

export default class DocNode extends Node {

	get name() {
		return 'doc'
	}

	get schema() {
		return {
			content: 'block+',
		}
	}

}
