context('/api/extensions/history', () => {
  before(() => {
    cy.visit('/api/extensions/history')
  })

  beforeEach(() => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor.focus()
      editor.setContent('<p>Mistake</p>')
    })
  })

  it('should make the last change undone', () => {
    cy.get('.ProseMirror').should('contain', 'Mistake')
    cy.get('.demo__preview button:first').click({ force: true })
    cy.get('.ProseMirror').should('not.contain', 'Mistake')
  })

  it('the keyboard shortcut should make the last change undone', () => {
    cy.get('.ProseMirror').trigger('keydown', { metaKey: true, key: 'z' })
    cy.get('.ProseMirror').should('not.contain', 'Mistake')
  })

  it('should apply the last undone change again', () => {
    cy.get('.ProseMirror').should('contain', 'Mistake')
    cy.get('.demo__preview button:first').click({ force: true })
    cy.get('.ProseMirror').should('not.contain', 'Mistake')
    cy.get('.demo__preview button:nth-child(2)').click({ force: true })
    cy.get('.ProseMirror').should('contain', 'Mistake')
  })

  it.skip('the keyboard shortcut should apply the last undone change again', () => {
    cy.get('.ProseMirror').trigger('keydown', { metaKey: true, key: 'z' })
    cy.get('.ProseMirror').should('not.contain', 'Mistake')

    cy.get('.ProseMirror').trigger('keydown', { metaKey: true, shiftKey: true, key: 'z' })
    cy.get('.ProseMirror').should('contain', 'Mistake')
  })
})
