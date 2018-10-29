import FloatingMenu from '../Utils/FloatingMenu'

export default {
	props: {
		editor: {
			default: null,
			type: Object,
		},
	},
	watch: {
		editor: {
			immediate: true,
			handler(editor) {
				if (editor) {
					this.$nextTick(() => {
						editor.registerPlugin(FloatingMenu(this.$el))
					})
				}
			},
		},
	},
	render(createElement) {
		if (this.editor) {
			return createElement('div', this.$scopedSlots.default({
				focused: this.editor.view.focused,
				focus: this.editor.focus,
				commands: this.editor.commands,
				isActive: this.editor.isActive.bind(this.editor),
			}))
		}
	},
}
