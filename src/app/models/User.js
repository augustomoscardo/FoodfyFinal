const db = require('../../config/db')

const { date } = require('../../lib/utils')

const Base = require('./Base')

Base.init({table: 'users'})

module.exports = {
    ...Base
}