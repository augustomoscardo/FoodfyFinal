const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const recipe = require('../validators/recipe')





const LoadService = {
    load(service, filte) {
        this.filter
        return this[service]()
    },
    async recipe() {
        const recipeResults = await Recipe.find(req.params.id)

        const recipe = recipeResults.rows[0]
    },
    async recipes() {

    },

}