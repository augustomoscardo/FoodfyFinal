const db = require('../../config/db')

const { date } = require('../../lib/utils')

const Base = require('./Base')

Base.init({table: 'users'})

module.exports = {
    ...Base,
    all() {
        return db.query(`
            SELECT * 
            FROM users
            ORDER BY users.name ASC`)
    },
    async create(data) {
        try {
            const query = `
            INSERT INTO users (
                name,
                email,
                is_admin,
                password,
                created_at
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email
        `

            const values = [
                data.name,
                data.email,
                data.is_admin || false,
                data.password,
                date(Date.now()).iso
            ]

            const results = await db.query(query, values)
            return results.rows[0]

        } catch (error) {
            console.error(error);
        }
    },
    async findOne(filters) {
        let query = 'SELECT * FROM users'

        Object.keys(filters).map(key => {
            query = `${query}
                ${key}
            `

            Object.keys(filters[key]).map(field => { 
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    },
    async update(id, fields) {
        let query = 'UPDATE users SET'
        
        Object.keys(fields).map((key, index, array) => {
            if ((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            }   else { 
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })
        await db.query(query)

        return
    },
    delete(id) {
        return db.query(`DELETE FROM users WHERE id = $1`, [id])
    }
}