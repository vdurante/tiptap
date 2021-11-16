context('/src/GuideContent/ReadOnly/React/', () => {
  before(() => {
    cy.visit('/src/GuideContent/ReadOnly/React/')
  })

  beforeEach(() => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor.commands.clearContent()
    })
  })

  it('should be read-only', () => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor.setEditable(false)
      cy.get('.ProseMirror').type('Edited: ')

      cy.get('.ProseMirror p:first').should('not.contain', 'Edited: ')
    })
  })

  it('should be editable', () => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor.setEditable(true)
      cy.get('.ProseMirror').type('Edited: ')

      cy.get('.ProseMirror p:first').should('contain', 'Edited: ')
    })
  })
})
