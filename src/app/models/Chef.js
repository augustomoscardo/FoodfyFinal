const { date } = require('../../lib/utils')

const db = require('../../config/db')
const fs = require("fs")

module.exports = {
    all() {
        return db.query(`
            SELECT * 
            FROM chefs
            ORDER BY id ASC`)
    },
    create(data) {
        const query = `
            INSERT INTO chefs (
                name,
                file_id,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `

        const values = [
            data.name,
            data.file_id,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes 
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id`, [id])
    },
    findRecipesOfChef(id) {
        return db.query(`
        SELECT *
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1`, [id])
    },
    findChefRecipes(id) {
        return db.query(`
            SELECT *
            FROM recipes
            WHERE chef_id = $1
            ORDER BY created_at DESC
        `, [id])
    },
    update(data) {

        const query = `
            UPDATE chefs SET
                name=$1,
                file_id=$2
            WHERE id = $3
        `

        const values = [
            data.name,
            data.file_id,
            data.id
        ]

        return db.query(query, values)
    },
    async delete(id) {
        try {
            // // get image of chef
            const results = await db.query(`
                SELECT files.* FROM files
                LEFT JOIN chefs ON (files.id = chefs.file_id)
                WHERE chefs.id = $1`, [id])

            const files = results.rows

            files.map(async file => {
                fs.unlinkSync(file.path)
                
                await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    
                return db.query(`DELETE FROM files WHERE id = $1`, [file.id])
            })



        } catch (error) {
            console.error(error);
        }
    },
    totalRecipesOfChef() {
        return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id`)
    },
    files(id) { // é o mesmo que o File.find()
        return db.query(`SELECT * FROM files 
        LEFT JOIN chefs ON (chefs.file_id = files.id)
        WHERE files.id = $1`, [id])
    }
}