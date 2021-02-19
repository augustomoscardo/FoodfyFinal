const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')

async function getImages(chefId) {
    let files = await Chef.files(chefId)
    files = files.map(file => ({
        id: file.file_id,
        name: file.name,
        src: `${file.path.replace("public", "")}`
    }))
    
    return files
}

async function format(chef) {
    const recipes = await Recipe.findAll({ where: { chef_id: chef.id }})

    const file = await getImages(chef.id)

    chef.image = file[0].src
    chef.files = file
    chef.total_recipes = recipes.length

    // console.log(file);

    return chef
}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        
        return this[service]()
    },
    async chef() {
        try {
            const chef = await Chef.findOne(this.filter)

            return format(chef)
        } catch (error) {
            console.error(error);
        }
    },
    async chefs() {
        try {
            const chefs = await Chef.findAll(this.filter)
            const chefsPromise = chefs.map(format)

            return Promise.all(chefsPromise)
        } catch (error) {
            console.error(error);
        }
    },
    format
}

module.exports = LoadService