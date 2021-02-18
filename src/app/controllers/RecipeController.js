const { date } = require('../../lib/utils')
const { unlinkSync} = require('fs')

const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Chef = require('../models/Chef')

const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {

        try {
            // const recipes = await LoadRecipeService.load('recipes')
            // console.log(recipes);

            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6

            let offset = limit * (page - 1)

            let recipes = await Recipe.paginate({ limit, offset })
            const recipesPromise = recipes.map(LoadRecipeService.format)

            recipes = await Promise.all(recipesPromise)

            // if (recipes = "") {
            //     const pagination = { page }

            //     return res.render('admin/recipes/index', { recipes, pagination })
            // }

            const pagination = {
                total: Math.ceil(recipes[0].total/limit),
                page
            }
            
            // const recipesResults = await Recipe.all()
            // const recipes = recipesResults.rows

            // if (!recipes) return res.send('Recipes not found!')

            // async function getImage(recipe_id) {
            //     const fileResults = await RecipeFile.findRecipeId(recipe_id)   
            //     const fileId = fileResults.rows[0].file_id
            //     const imageResults = await File.find(fileId)
            //     const image = imageResults.rows.map(image => `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`)

            //     return image[0]
            // }

            // const recipesPromise = recipes.map(async recipe => {
            //     recipe.image = await getImage(recipe.id)

            //     return recipe
            // })

            // const lastAdded = await Promise.all(recipesPromise)
            
            return res.render('admin/recipes/index', { recipes, pagination })
            
        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res) {
    
        try {
            // get chefs
            const chefsSelectOptions = await Chef.findAll()
            
            return res.render('admin/recipes/create', { chefsSelectOptions })

        } catch (error) {
            console.error(error)
        }
        
    },
    async post(req, res) {

        try {
            const { title, chef, ingredients, preparation, information } = req.body

            // create recipe
            const recipe = await Recipe.create({
                title,
                chef,
                user_id: req.session.userId,
                ingredients,
                preparation,
                information,
                created_at: date(Date.now()).iso
            })

            // create files
            let files;

            const filesPromise = req.files.map(file => File.createRecipefiles({
                name: file.filename,
                path: file.path,
                recipe_id: recipe
            }))

            files = await Promise.all(filesPromise)

            // const filesResults = await Promise.all(req.files.map(file => File.create(file)))  //mapeando cada arquivo para operar o File.create
            // const files = filesResults.map(result => result.rows[0]) //para cada results do File.create, mapear cada um acessando o rows[0] (que é o id do File que criei)

            // // unite recipe and files
            // files.map(file => RecipeFile.create({ recipe_id: recipe.id, file_id: file.id  })) // 

            return res.redirect(`/admin/recipes/${recipe.id}`)
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {

        try {
            const recipe = await LoadRecipeService.load("recipe", { where: { id: req.params.id }})



            // const recipeResults = await Recipe.find(req.params.id)

            // const recipe = recipeResults.rows[0]

            // if (!recipe) return res.send('Recipe not found!')
          
            // // get images
            // const results = await RecipeFile.findRecipeId(req.params.id)
            // const recipeFilesPromise = await Promise.all(results.rows.map(file => File.find(file.file_id)))
            // // console.log(JSON.stringify(recipeFilesPromise));

            // let recipeFiles = recipeFilesPromise.map(result => result.rows[0])
            // recipeFiles = recipeFiles.map(file => ({
            //     ...file,
            //     src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            // }))

            return res.render('admin/recipes/show', { recipe })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {

        try {
            const recipe = await LoadRecipeService.load("recipe", { where: { id: req.params.id }})

            // get chefs
            const chefsSelectOptions = await Chef.findAll()




            // let results = await Recipe.find(req.params.id)

            // const recipe = results.rows[0]

            // if (!recipe) return res.send('Recipe not found!')

            // // get chefs
            // results = await Recipe.chefsSelectOptions() 

            // const chefOptions = results.rows

            // // get images
            // results = await RecipeFile.files(req.params.id)
            // let files = results.rows
            // files = files.map(file => ({
            //     ...file,
            //     src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            // }))

            return res.render('admin/recipes/edit', { recipe, chefsSelectOptions })

        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {

        try {
            // const keys = Object.keys(req.body)

            // for (key of keys) {
            //     if (req.body[key] == "" && key != "removed_files") {
            //         return res.send('Please fill all fields!')
            //     }
            // }

            req.body.ingredients = req.body.ingredients.filter(ingredient => ingredient !== '')
            req.body.preparation = req.body.preparation.filter(preparation => preparation !== '')


            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file => File.createRecipeFiles({name: file.filename, path: file.path, recipe_id: req.body.id}))

                await Promise.all(newFilesPromise)
            }

            // remove photo from db
            if (req.body.removed_files) {
                // 1,2,3,
                const removedFiles = req.body.removed_files.split(",") // [1,2,3,]

                const lastIndex = removedFiles.length - 1

                removedFiles.splice(lastIndex, 1) // [1,2,3]

                const removedFilesPromise = removedFiles.map(async id => {
                    const file = await File.find(id)
                    try {
                        unlinkSync(file.path)
                    } catch (error) {
                        console.error(error);
                    }
                    await Promise.all(removedFilesPromise)
    
                    await File.delete(id)
                })
            }

            const { title, chef, ingredients, preparation, information } = req.body

            await Recipe.update(req.body.id, {
                title, 
                chef, 
                ingredients, 
                preparation, 
                information
            })

            return res.redirect(`/admin/recipes/${req.body.id}`)

        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {

        try {
            // get recipe files
            const files = await Recipe.files(req.body.id)
            // console.log(files);

            // delete recipe
            await Recipe.delete(req.body.id)
            // remove files from 'public'
            files.map(file => {
                try {
                    unlinkSync(file.path)
                    await File.delete(file.file_id)        
                } catch (error) {
                    console.error(error);
                }
            })

            // delete recipe by recipe_id and delete files by file_id from RecipeFile reference
            await Promise.all(recipeFiles.rows.map(async recipeFile => {
                await Recipe.delete(recipeFile.recipe_id)
                await File.delete(recipeFile.file_id)
            }))  

            return res.redirect(`/admin/recipes`)

        } catch (error) {
            console.error(error)
        }
    },
}