describe('My First Test', function() {
  it('Visits the React app', function() {
    cy.visit('http://menpedro-react-app.s3-website-us-east-1.amazonaws.com/')
    cy.contains('version 3')
  })
})
