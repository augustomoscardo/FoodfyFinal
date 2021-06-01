const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const Recipe = require('./src/app/models/Recipe')
const File = require('./src/app/models/File')

let usersIds = [], chefsIds = []

let recipesIds =[],
totalRecipes =  10,
totalChefs = 6,
totalUsers = 6

async function createUser() {
  try {
    const users = []

    const password = await hash('111', 8)

    while (users.length < totalUsers) {
      users.push({
        name: faker.name.firstName(),
        email: faker.internet.email(),
        is_admin: faker.random.boolean(),
        password,
      })

    }   
    const usersPromise = users.map(user => User.create(user))

  usersIds = await Promise.all(usersPromise)

  } catch (error) {
    console.error(error);
  }
}

async function createChef() { 
  try {
    // first create file   
    let files = []

    while (files.length < totalChefs) {
      files.push({
        name: faker.image.image(),
        path: `public/img/placeholder.png`
      })
    }
    const filesPromise = files.map(file => File.create(file))

    const [fileId] = await Promise.all(filesPromise)

    // create chef
    let chefs = []

    while (chefs.length < totalChefs) {
      chefs.push({
        name: faker.name.firstName(),
        file_id: fileId
      })
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef))

    chefsIds = await Promise.all(chefsPromise)

  } catch (error) {
    console.error(error);
  }
}

async function createRecipe() {
  try {
    let recipes = [],
    ingredients = [],
    preparation = []

    for (let i = 0; i <= 6; i++) {
      ingredients.push(faker.lorem.words(Math.ceil(Math.random() * 8)))
      preparation.push(faker.lorem.words(Math.ceil(Math.random() * 5)))
    }

    // create recipe
    while (recipes.length < totalRecipes) {
      recipes.push({
        title: faker.name.title(),
        chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
        user_id: usersIds[Math.floor(Math.random() * totalUsers)],
        ingredients,
        preparation,
        information: faker.lorem.words(Math.ceil(Math.random() * 8))
      })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))

    recipesIds = await Promise.all(recipesPromise)

    let files = []

    recipesIds
      .sort(() => .5 - Math.random())
      .map(id => {
        files.push({
          name: faker.image.image(),
          path: `public/img/placeholder.png`,
          // recipe_id: recipesIds[Math.floor(Math.random() * totalRecipes)]
          recipe_id: id
        })
      })

    const filesPromise = files.map(file => File.createRecipeFiles(file))

    await Promise.all(filesPromise)

  } catch (error) {
    console.error(error);
  }
}

async function init() {
  await createUser()
  await createChef()
  await createRecipe()
  await console.log("Deu tudo certo!");
}

init()