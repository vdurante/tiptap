export default {
	props: {
		editor: {
			default: null,
			type: Object,
		},
	},
	render(createElement) {
		if (!this.editor) {
			return null
		}

		return createElement('div', this.$scopedSlots.default({
			focused: this.editor.view.focused,
			focus: this.editor.focus,
			commands: this.editor.commands,
			isActive: this.editor.isActive.bind(this.editor),
			markAttrs: this.editor.markAttrs.bind(this.editor),
		}))
	},
}
