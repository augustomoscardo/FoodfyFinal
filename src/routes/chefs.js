const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ChefValidator = require('../app/validators/chef')

const ChefController = require('../app/controllers/ChefController')


// ADMIN - CHEFS
routes.get("/", ChefController.index); 
routes.get("/create", ChefController.create); 
routes.get("/:id", ChefController.show); 
routes.get("/:id/edit", ChefController.edit); 

routes.post("/", multer.array("avatar", 1), ChefValidator.post,  ChefController.post); 
routes.put("/", multer.array("avatar", 1), ChefValidator.update, ChefController.put);
routes.delete("/", ChefController.delete);



module.exports = routes
