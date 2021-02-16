const express = require('express')
const routes = express.Router()

const SiteController = require('../app/controllers/SiteController')


// SITE
routes.get("/", SiteController.home);
routes.get("/about", SiteController.about);
routes.get("/recipes", SiteController.recipes);
routes.get("/recipes/:id", SiteController.recipe);
routes.get("/chefs", SiteController.chefs);
routes.get("/searchResult", SiteController.searchResult);




module.exports = routes