const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    async files(id) { // é o mesmo que o File.find()
        try {
            const query = `SELECT * FROM files 
            LEFT JOIN chefs ON (chefs.file_id = files.id)
            WHERE chefs.id = $1`

            const results = await db.query(query, [id])

            return results.rows
        } catch (error) {
            console.error(error);
        }
    }
}