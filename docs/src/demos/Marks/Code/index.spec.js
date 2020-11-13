context('/api/marks/code', () => {
  before(() => {
    cy.visit('/api/marks/code')
  })

  beforeEach(() => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor.commands.setContent('<p>Example Text</p>')
      editor.commands.selectAll()
    })
  })

  it('should parse code tags correctly', () => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor.commands.setContent('<p><code>Example Text</code></p>')
      expect(editor.getHTML()).to.eq('<p><code>Example Text</code></p>')

      editor.commands.setContent('<code>Example Text</code>')
      expect(editor.getHTML()).to.eq('<p><code>Example Text</code></p>')
    })
  })

  it('should mark the selected text as inline code', () => {
    cy.get('.demo__preview button:first')
      .click()

    cy.get('.ProseMirror')
      .find('code')
      .should('contain', 'Example Text')
  })

  it('should toggle the selected text as inline code', () => {
    cy.get('.demo__preview button:first')
      .click()

    cy.get('.ProseMirror')
      .type('{selectall}')

    cy.get('.demo__preview button:first')
      .click()

    cy.get('.ProseMirror code')
      .should('not.exist')
  })

  it('should make inline code from the markdown shortcut', () => {
    cy.get('.ProseMirror')
      .type('`Example`')
      .find('code')
      .should('contain', 'Example')
  })
})
