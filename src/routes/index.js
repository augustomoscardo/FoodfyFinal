const express = require('express')
const routes = express.Router()

const { onlyUsers, userIsLogged } = require('../app/middlewares/session')

const site = require('./site')
const chefs = require('./chefs')
const recipes = require('./recipes')
const users = require('./users')
const profile = require('./profile')
const { route } = require('./users')

routes.use('/', site)

routes.use('/admin/chefs', onlyUsers, chefs)
routes.use('/admin/recipes', onlyUsers, recipes)
routes.use('/admin/users', users)
routes.use('/admin/profile', profile)

//routes.use(adminMiddleware)

// routes.use('/admin', admin)
// routes.get('/admin/session/login', (req, res) => res.render("admin/session/login", {
//     complete_header: false
// }))

// ALIAS
// route.get('/accounts', function(req, res) {
//     return res.redirect('/admin/users/login')
// })


routes.use(function(req, res) {
    res.status(404).render("not-found");
})

module.exports = routes
