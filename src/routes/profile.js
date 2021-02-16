const express = require('express')
const routes = express.Router()

const { onlyUsers} = require('../app/middlewares/session')

const ProfileValidator = require('../app/validators/profile')

const ProfileController = require('../app/controllers/ProfileController')

// Rotas de perfil de um usuário logado
routes.get('/', onlyUsers, ProfileValidator.profileIndex, ProfileController.index); // Mostrar o formulário com dados do usuário logado
routes.put('/', onlyUsers, ProfileValidator.profileUpdate, ProfileController.update)// Editar o usuário logado


module.exports = routes