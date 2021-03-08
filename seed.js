const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Chef = require('./src/app/models/Chef')
const Recipe = require('./src/app/models/Recipe')
const File = require('./src/app/models/File')

let usersIds = []
let chefsIds = []
let recipesIds =[]
let totalRecipes =  18 
let totalChefs = 6
let totalUsers = 6

async function createUser() {
    const users = []
    
    const password = await hash('111', 8)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            is_admin: faker.random.boolean(),
            password,
        })

        const usersPromise = users.map(user => User.create(user))

        usersIds = await Promise.all(usersPromise)
    }
}

async function createChef() { 
    // first create file   
    let files = []

    while (files.length < totalChefs) {
        files.push({
            name: faker.image.image(),
            path: `public\images\placeholder.png`
        })
    }
    const filesPromise = files.map(file => File.create(file))

    const fileId = await Promise.all(filesPromise)

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
}

async function createRecipe() {
    let files = []



    let recipes = []

    // create recipe
    while (recipes.length < totalRecipes) {
        recipes.push({
            title,
            chef_id,
            user_id,
            ingredients,
            preparation,
            information
        })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))

    recipesIds = await Promise.all(recipesPromise)
}

async function init() {
    await createUser()
    await createChef()
    await createRecipe()
}
