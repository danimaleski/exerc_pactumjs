const { reporter, flow, mock } = require('pactum');
const pf = require('pactum-flow-plugin');

function addFlowReporter() {
    pf.config.url = 'http://localhost:8080'; // pactum flow server url
    pf.config.projectId = 'lojaebac-graphql';
    pf.config.projectName = 'Loja EBAC GraphQL';
    pf.config.version = '1.0.0';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    reporter.add(pf.reporter);
}

before(async () => {
    addFlowReporter();
    await mock.start(4000);
});

after(async () => {
    await mock.stop();
    await reporter.end();
});

it('Deve excluir uma categoria - Contrato', async () => {
  await flow("Exclusão")
    .post('http://localhost:4000/graphql')
    .withHeaders("Authorization", `#token`)
    .withGraphQLQuery(`
      mutation deleteCategory($deleteCategoryId: ID!) {
        deleteCategory(id: $deleteCategoryId)
      } 
  `)
    .withGraphQLVariables({
      "deleteCategoryId": "6630b14f2a3e1a38e47bd9a5"
    })
    .expectStatus(200)
    .inspect()
    .expectJsonMatch({
      data: {
        deleteCategory: true
      }
    });
});