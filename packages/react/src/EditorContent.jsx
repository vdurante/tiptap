import React from 'react'

export class PureEditorContent extends React.Component {
  constructor(props) {
    super(props)
    this.editorContentRef = React.createRef()
    this.editorPortalRef = React.createRef()

    this.state = {
      editor: this.props.editor
    }
  }

  componentDidUpdate() {
    const { editor } = this.props

    if (editor && editor.options.element) {
      const element = this.editorContentRef.current

      element.appendChild(editor.options.element.firstChild)

      editor.setOptions({
        element,
      })

      editor.contentComponent = this

      // TODO: why setTimeout?
      setTimeout(() => {
        editor.createNodeViews()
      }, 0)
    }
  }

  render() {
    return (
      <div ref={this.editorContentRef} />
    )
  }
}

export const EditorContent = React.memo(PureEditorContent);
