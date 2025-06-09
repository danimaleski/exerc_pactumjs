const { reporter, spec, flow, handler, mock } = require('pactum');
const pf = require('pactum-flow-plugin');

function addFlowReporter() {
    pf.config.url = 'http://localhost:8080';
    pf.config.projectId = 'lojaebac-front';
    pf.config.projectName = 'Loja EBAC Front';
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

beforeEach(async () => {
    await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withGraphQLQuery(`
        mutation AuthUser($email: String, $password: String) {
            authUser(email: $email, password: $password) {
              success
              token
            }
          }
    `)
        .withGraphQLVariables({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .stores('token', 'data.authUser.token')

})

handler.addInteractionHandler('Excluir Categoria Response', (ecr) => {
    const body = JSON.parse(ecr.request.body);

    if(
      body.query.includes('mutation deleteCategory') && 
      body.variables.deleteCategoryId === '6630b14f2a3e1a38e47bd9a5'
    ){
      return {
        scenario: 'lojaebac-graphql',
        request: {
            method: 'DELETE',
            path: '/graphql',
        },
        response: {
            status: 200,
            body: {
                "data": {
                      deleteCategory: true
                    }
                }
            }
        }
    }
    return {
      status: 400,
      body: {
        errors: [{ message: 'Invalid Request' }]
      }
    }
})

it('Deve excluir uma categoria - Contrato', async () => {
  await flow("Exclusão")
    .useInteraction("Excluir Categoria Response")
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