describe('My First Test', function() {
  it('Visits the React app', function() {
    cy.visit('http://menpedro-react-app-preprod-es.s3-website-us-east-1.amazonaws.com/')
    cy.contains('Welcome to React')
    cy.contains('This is the welcome step')
    cy.contains('Next').click()
    cy.contains('This is a Spain compliance step')
    cy.contains('Next').click()
    cy.contains('This is yet another (common) step')
  })
})
