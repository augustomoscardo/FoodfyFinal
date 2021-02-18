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
        RETURING id`

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
        `
        values = [
            recipe_id,
            file_id
        ]
        console.log(query, values);
        return db.query(query, values)
    }
}

// create({ filename, path }) {
//     const query = `
//         INSERT INTO files (
//             name,
//             path
//         ) VALUES ($1, $2)
//         RETURNING id
//     `

//     const values = [
//         filename,
//         path
//     ]

//     return db.query(query, values)
// },
// find(id) {
//     return db.query(`
//         SELECT * FROM files WHERE id = $1`, [id])
// },
// async delete(id) {
//     try {
//         const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
//         const file = result.rows[0]

//         fs.unlinkSync(file.path)

//         return db.query(`DELETE FROM files WHERE id = $1`, [id])

//     } catch (err) {
//         console.error(err)
//     }
// }