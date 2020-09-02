context('/api/extensions/bold', () => {
  beforeEach(() => {
    cy.visit('/api/extensions/bold')

    cy.get('.ProseMirror').window().then(window => {
      const { editor } = window
      editor.setContent('<p>Example Text</p>')
      editor.focus().selectAll()
    })
  })

  describe('bold', () => {
    it('should make the selected text bold', () => {
      cy.get('.demo__preview button:first').click({ force: true })
      cy.get('.ProseMirror').contains('strong', 'Example Text')
    })

    it('should toggle the selected text bold', () => {
      cy.get('.demo__preview button:first').dblclick({ force: true })
      cy.get('.ProseMirror strong').should('not.exist')
    })
  })
})