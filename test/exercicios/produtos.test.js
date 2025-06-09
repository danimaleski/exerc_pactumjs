// test.js
const { spec, request } = require('pactum');

request.setBaseUrl('http://lojaebac.ebaconline.art.br');

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

it('Deve adicionar um novo produto com sucesso', async () => {
    await spec()
      .post('http://lojaebac.ebaconline.art.br/api/addProduct')
      .withHeaders('Authorization', token)
      .withJson({
        "name": "Tênis Esportivo",
        "price": 199.99,
        "quantity": 50,
        "categories": "67e1c686ad0a28d184fb07b7",
        "description": "Tênis minimalista",
        "photos": "https://shakalloja.com.br/cdn/shop/files/S3a55955335434aa1a6902da69d3b3937j_800x.webp?v=1725508546",
        "popular": true,
        "visible": true,
        "location": "SP",
        "additionalDetails": "marca X",
        "specialPrice": 150
      })
      .expectStatus(200)
      .expectJson('success', true)

  });

  it('Deve editar um produto com sucesso', async () => {
    await spec()
      .put('http://lojaebac.ebaconline.art.br/api/editProduct/67e1c686ad0a28d184fb07b7')
      .withHeaders('Authorization', token)
      .withJson({
        "name": "Tênis Esporte Editado",
        "price": 199.99,
        "quantity": 50,
        "categories": "67e1c686ad0a28d184fb07b7",
        "description": "Tênis minimalista Editado",
        "photos": "https://shakalloja.com.br/cdn/shop/files/S3a55955335434aa1a6902da69d3b3937j_800x.webp?v=1725508546",
        "popular": true,
        "visible": true,
        "location": "SP",
        "additionalDetails": "marca XY",
        "specialPrice": 150
      })
      .expectStatus(200)
      .expectJson('success', true)

  });

  it.only('Deve excluir um produto com sucesso', async () => {
    await spec()
      .delete('http://lojaebac.ebaconline.art.br/api/deleteProduct/67e1c686ad0a28d184fb07b7')
      .withHeaders('Authorization', token)
      .expectStatus(200)
      .expectJson('success', true)

  });