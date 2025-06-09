// test.js
const { spec } = require('pactum');

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


it('Deve adicionar uma nova categoria', async () => {
  await spec()
    .post('http://lojaebac.ebaconline.art.br/graphql')
    .withHeaders("Authorization", `#token`)
    .withGraphQLQuery(`
      mutation AddCategory($name: String, $photo: String) {
        addCategory(name: $name, photo: $photo) {
            name
            photo
          }
        } 
  `)
    .withGraphQLVariables({
      "name": "Acessórios",
      "photo": "https://img.freepik.com/fotos-gratis/acessorios-de-vista-superior-para-viajar-com-conceito-de-vestuario-feminino-telemovel-relogio-saco-chapeu-mapa-camera-colar-calcas-e-oculos-escuros-na-mesa-de-madeira-branca_1921-106.jpg?semt=ais_hybrid&w=740"
    })
    .expectStatus(200)
    .inspect()
    .expectJsonMatch({
      data: {
        addCategory: {
          name: "Acessórios",
          photo: "https://img.freepik.com/fotos-gratis/acessorios-de-vista-superior-para-viajar-com-conceito-de-vestuario-feminino-telemovel-relogio-saco-chapeu-mapa-camera-colar-calcas-e-oculos-escuros-na-mesa-de-madeira-branca_1921-106.jpg?semt=ais_hybrid&w=740"
        }
      }
    })
});

it('Deve editar uma categoria', async () => {
  await spec()
    .post('http://lojaebac.ebaconline.art.br/graphql')
    .withHeaders("Authorization", `#token`)
    .withGraphQLQuery(`
      mutation editCategory($editCategoryId: ID!, $name: String, $photo: String) {
        addCategory(id: $editCategoryId, name: $name, photo: $photo) {
            name
            photo
          }
        } 
  `)
    .withGraphQLVariables({
      "editCategoryId": "6630b14f2a3e1a38e47bd9a5",
      "name": "Acessórios Atualizados",
      "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWbJg6g6LW8UaJiXVRbxoGXZdGbfYQnTkhhNMS_ph76zSZfRMk9Q6stMPwYWfM9aXBw0Q&usqp=CAU"
    })
    .expectStatus(200)
    .inspect()
    .expectJsonMatch({
      data: {
        editCategory: {
          //editCategoryId: "6630b14f2a3e1a38e47bd9a5",
          name: "Acessórios Atualizados",
          photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWbJg6g6LW8UaJiXVRbxoGXZdGbfYQnTkhhNMS_ph76zSZfRMk9Q6stMPwYWfM9aXBw0Q&usqp=CAU"
        }
      }
    })
});

it('Deve excluir uma categoria', async () => {
  await spec()
    .post('http://lojaebac.ebaconline.art.br/graphql')
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


