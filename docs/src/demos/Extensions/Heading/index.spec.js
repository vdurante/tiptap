context('/api/extensions/heading', () => {
  before(() => {
    cy.visit('/api/extensions/heading')
  })

  beforeEach(() => {
    cy.get('.ProseMirror').then(([{ editor }]) => {
      editor.setContent('<p>Example Text</p>')
      editor.focus()
      editor.selectAll()
    })
  })

  it('the button should make the selected line a h1', () => {
    cy.get('.ProseMirror h1').should('not.exist')
    cy.get('.demo__preview button:nth-child(1)').click({ force: true })
    cy.get('.ProseMirror').find('h1').should('contain', 'Example Text')
  })

  it('the button should make the selected line a h2', () => {
    cy.get('.ProseMirror h2').should('not.exist')
    cy.get('.demo__preview button:nth-child(2)').click({ force: true })
    cy.get('.ProseMirror').find('h2').should('contain', 'Example Text')
  })

  it('the button should make the selected line a h3', () => {
    cy.get('.ProseMirror h3').should('not.exist')
    cy.get('.demo__preview button:nth-child(3)').click({ force: true })
    cy.get('.ProseMirror').find('h3').should('contain', 'Example Text')
  })
})