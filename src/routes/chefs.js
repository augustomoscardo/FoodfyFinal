const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const { userIsAdmin } = require('../app/middlewares/session')

const ChefValidator = require('../app/validators/chef')

const ChefController = require('../app/controllers/ChefController')


// ADMIN - CHEFS
routes.get("/", ChefController.index); 
routes.get("/create", userIsAdmin, ChefController.create); 
routes.get("/:id", ChefController.show); 
routes.get("/:id/edit", userIsAdmin, ChefController.edit); 

routes.post("/", multer.array("avatar", 1), ChefValidator.post,  ChefController.post); 
routes.put("/", multer.array("avatar", 1), ChefValidator.update, ChefController.put);
routes.delete("/", ChefController.delete);



module.exports = routes
