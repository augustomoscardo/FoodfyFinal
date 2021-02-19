const { date } = require('../../lib/utils')
const { unlinkSync} = require('fs')

const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Chef = require('../models/Chef')

const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {

        try {
            
            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6

            let offset = limit * (page - 1)

            let recipes = await Recipe.paginate({ limit, offset })

            const recipesPromise = recipes.map(LoadRecipeService.format)

            recipes = await Promise.all(recipesPromise)

            if (recipes === "") {
                const pagination = { page }

                return res.render('admin/recipes/index', { recipes, pagination })
            }

            const pagination = {
                total: Math.ceil(recipes.length/limit),
                page
            }
            
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
console.log(req.body);
            // create recipe
            const recipe = await Recipe.create({
                title,
                chef_id: chef,
                user_id: req.session.userId,
                ingredients,
                preparation,
                information,
                created_at: date(Date.now()).iso
            })
            // create files
            let files;

            const filesPromise = req.files.map(file => File.createRecipeFiles({
                name: file.filename,
                path: file.path,
                recipe_id: recipe
            }))

            files = await Promise.all(filesPromise)

            return res.redirect(`/admin/recipes/${recipe}`)
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {

        try {
            const recipe = await LoadRecipeService.load("recipe", { where: { id: req.params.id }})
// console.log(recipe);
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
            files.map(async file => {
                try {
                    unlinkSync(file.path)
                    await File.delete(file.file_id)        
                } catch (error) {
                    console.error(error);
                }
            })

            return res.redirect(`/admin/recipes`)

        } catch (error) {
            console.error(error)
        }
    },
}