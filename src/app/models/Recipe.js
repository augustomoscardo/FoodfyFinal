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

        let query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE 1 = 1
        `

        if (filter) {
            query += ` AND (recipes.title ILIKE '%${filter}%')
            OR chefs.name ILIKE '%${filter}%'`
        }
        
        const results = await db.query(query)
        
        return results.rows
    },
    async findPaginatedRecipesByUserId({ id, limit, offset }) {
        try {
            const query = `
                SELECT recipes.*, 
                chefs.name AS chef_name,
                (SELECT count(*) FROM recipes) AS total
                FROM recipes
                LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
                LEFT JOIN users ON (users.id = recipes.user_id)
                WHERE user_id = ${id}
                LIMIT ${limit} OFFSET ${offset}
            `

            const results = await db.query(query)

            return results.rows

        } catch (error) {
            console.error(error);
        }
    }
}