const { date } = require('../../lib/utils')
const fs = require('fs')
const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    async files(id) {
        try {
            const query = ` SELECT * FROM files
            LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
            WHERE recipe_files.recipe_id = $1
            `
            const results = await db.query(query, [id])
            return results.rows

        } catch (error) {
            console.error(error);
        }
    },
    async search({ filter }) {

        let query = "",
        filterQuery = `WHERE`

        filterQuery = `${filterQuery}
            recipes.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            ORDER BY updated_at DESC
        `

        query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
        `
        
        const results = db.query(query)
        return results.rows
    },
}