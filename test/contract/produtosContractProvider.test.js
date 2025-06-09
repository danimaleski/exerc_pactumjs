const { reporter, spec, flow, mock } = require('pactum');
const pf = require('pactum-flow-plugin');

function addFlowReporter() {
    pf.config.url = 'http://localhost:8080';
    pf.config.projectId = 'lojaebac-api';
    pf.config.projectName = 'Loja EBAC API';
    pf.config.version = '1.0.0';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    reporter.add(pf.reporter);
}

before(async () => {
    addFlowReporter();
    await mock.start();
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

it('Deve excluir um produto com sucesso - Contrato', async () => {
    await flow('Produto')
      .delete('http://lojaebac.ebaconline.art.br/api/deleteProduct/67e1c686ad0a28d184fb07b7')
      .withHeaders('Authorization', token)
      .expectStatus(200)
      .expectJson('success', true)

  });