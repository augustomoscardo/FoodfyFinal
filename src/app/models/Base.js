const db = require('../../config/db')

function find( filters, table) {
    let query = `SELECT * FROM ${table}`

    if (filters) {
        Object.keys(filters).map(key => {
            query += ` ${key}`

            Object.keys(filters[key]).map(field => {
                query += ` ${field} = '${filters[key][field]}'`
            })
        })
    }

    return db.query(query)
}

const Base = {
    init({table}) {

        if (!table) throw new Error('Invalid Params')

        this.table = table

        return this
    },
    async find(id) {

        const results = await find({ where: { id } }, this.table)

        return results.rows[0]
    },
    async findOne(filters) {

        const results = await find(filters, this.table)

        return results.rows[0]
    }, 
    async findAll(filters) {

        const results = await find(filters, this.table)

        return results.rows
    },
    async create(fields) {
        try {
            let keys = [],
            values = []

            Object.keys(fields).map(key => {
                keys.push(key)

                if (fields[key] !== 'file_id' && Array.isArray(fields[key])) {
                    
                    const formattedValues = fields[key].map(item => `'${item}'`)

                    //VALUES('chef', ARRAY['123'], '345')

                    return values = [...values, `ARRAY[${formattedValues}]`]
                }

                values.push(`'${fields[key]}'`)                           
            })

            const query = `INSERT INTO ${this.table} 
                (${keys.join(',')})
                VALUES (${values.join(',')})
                RETURNING id
            `

            const results = await db.query(query)

            return results.rows[0].id

        } catch (error) {
            console.error(error);
        }
    },
    async update(id, fields) {
        try {
            let update = []

            Object.keys(fields).map(key => {
                const line = `${key} = '${fields[key]}'`

                if (fields[key] === 'file_id' || fields[key] !== 'file_id') {
                    if (Array.isArray(fields[key])) {
                        const formattedValues = fields[key].map(item => `'${item}'`)

                    //VALUES('chef', ARRAY['123'], '345')

                        return update = [...update, `${key} = ARRAY[${formattedValues}]`] // para pegar os fields que são array
                    }

                   return update = [...update, `${line}`]
                }

                update.push(line)
            })

            const query = `UPDATE ${this.table} SET
                ${update.join(',')} WHERE id = ${id}`

            const results = await db.query(query)
            return results.rows[0]

        } catch (error) {
            console.error(error);
        }
    },
    delete(id) {
        return db.query(`DELETE FROM  ${this.table} WHERE id = $1`, [id])
    },
    async paginate({ limit, offset, where }) {
        try { 
             // ideia of "where" is being used in RecipeController
            const query = `
                SELECT ${this.table}.*, (SELECT count(*) FROM ${this.table}) AS total
                FROM ${this.table}
                ${where ? `WHERE ${where.column} = ${where.value}` : ''}
                LIMIT ${limit} OFFSET ${offset}
            `

            const results = await db.query(query)

            return results.rows

        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Base