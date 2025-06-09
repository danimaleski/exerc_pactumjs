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

let token;
beforeEach(async () => {
    token = await spec()
        .post('/public/authUser')
        .withJson({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .returns('data.token')

})

handler.addInteractionHandler('Produto Response', () => {
    return {
        provider: 'lojaebac-api',
        flow: 'Produto',
        request: {
            method: 'DELETE',
            path: '/api/deleteProduct/67e1c686ad0a28d184fb07b7',
            body: {
                "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3OWY1MGViMGNmMGE5MTMyNThiMjg2YyIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTc0ODkwNjUzOCwiZXhwIjoxNzQ4OTkyOTM4fQ.8gAIAeYzxv4qjNKsMr7GnYHmmLvNRezAK3qwt4E4tjY"
            }
        },
        response: {
            status: 200,
            body: {
                "success": true,
                "message": "product deleted"
                }
            }
        }
    })

it('Deve excluir um produto com sucesso - Contrato', async () => {
    await flow('Produto')
      .useInteraction('Produto Response')
      .delete('http://lojaebac.ebaconline.art.br/api/deleteProduct/67e1c686ad0a28d184fb07b7')
      .withHeaders('Authorization', token)
      .expectStatus(200)
      .expectJson('success', true)
  });