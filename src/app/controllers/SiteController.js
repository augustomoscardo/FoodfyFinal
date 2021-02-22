const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

const LoadRecipeService = require('../services/LoadRecipeService')
const LoadChefService = require('../services/LoadChefService')

module.exports = {
    async home(req, res) {

        try {
            const allRecipes = await LoadRecipeService.load("recipes")

            const recipes = allRecipes.filter((recipe, index) => index > 2 ? false : true)

            if (!recipes) return res.render('not-found')
                    
            return res.render('site/home', { recipes })

        } catch (error) {
            console.error(error);
        } 
    },
    about(req, res) {
        
        try {
            
            return res.render('site/about')
            
        } catch (error) {
            console.error(error);
        }  
    },
    async recipes(req, res) {
        
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

            return res.render('site/recipes', { recipes, pagination })

        } catch (error) {
            console.error(error);
        }   
    },
    async recipe(req, res) {
    
        try {
            const recipe = await LoadRecipeService.load("recipe", { where: { id: req.params.id }})

            return res.render('site/recipe', { recipe })

        } catch (error) {
            console.error(error);
        }   
    },
    async searchResult(req, res) {

        try {
            let { filter } = req.query

            if (!filter || filter.toLowerCase() == 'toda a loja') filter = null

            let recipes = await Recipe.search({filter})

            const recipesPromise = recipes.map(LoadRecipeService.format)

            recipes = await Promise.all(recipesPromise)
            
            const search = {
                term: filter || 'Todas as receitas',
                total: recipes.length
            }

            return res.render('site/searchResult', { recipes, search })
            
        } catch (error) {
            console.error(error);
        }  
    },
    async chefs(req, res) {

        try {
            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6

            let offset = limit * (page - 1)

            let chefs = await Chef.paginate({ page, limit, offset })
            
            const chefsPromise = chefs.map(LoadChefService.format)

            chefs = await Promise.all(chefsPromise)

            if (chefs === "") {
                const pagination = { page }

                return res.render('admin/chefs/index', { chefs, pagination })
            }

            const pagination = {
                total: Math.ceil(chefs.length/limit),
                page
            }

            return res.render('site/chefs', { chefs, pagination })
                     
        } catch (error) {
            console.error(error);
        }  
    },
}