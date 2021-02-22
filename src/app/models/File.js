const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'files' })

module.exports = {
    ...Base,
    // Função específica para criar os files e unir com as receitas na tabela pivô
    async createRecipeFiles({name, path, recipe_id}) {
        // create  files
        let query = ` INSERT INTO files (
            name,
            path
        ) VALUES ( $1, $2)
        RETURNING id
        `

        let values = [
            name,
            path
        ]
        
        const results = await db.query(query, values )

        let file_id = results.rows[0].id

        // create union in recipe_files
        query = ` INSERT INTO recipe_files (
            recipe_id,
            file_id
        ) VALUES ($1, $2)
        RETURNING id
        `
        values = [
            recipe_id,
            file_id
        ]
        
        return db.query(query, values)
    }
}