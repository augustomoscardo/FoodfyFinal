const express = require('express')
const routes = express.Router()

const { onlyUsers, userIsLogged, userIsAdmin } = require('../app/middlewares/session')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

// Login - Logout
routes.get('/login', userIsLogged, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// Reset - Forgot Password
routes.get('/forgot-password', SessionController.forgotForm) // rota para formulário de esquecimento de password
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.get('/reset-password', SessionController.resetForm)
routes.post('/reset-password', SessionValidator.reset, SessionController.reset)

// ADMIN - USERS

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', onlyUsers, userIsAdmin, UserController.list); //Mostrar a lista de usuários cadastrados

routes.get('/register', onlyUsers, userIsAdmin, UserController.registerForm) // Formulário p/ registro
routes.post('/', onlyUsers, userIsAdmin, UserValidator.post, UserController.post); //Cadastrar um usuário

routes.get('/:id/edit', onlyUsers, userIsAdmin, UserValidator.edit, UserController.edit) // Página de edição
routes.put('/', onlyUsers, userIsAdmin, UserValidator.update, UserController.update); // Editar um usuário

routes.delete('/', onlyUsers, userIsAdmin, UserValidator.AdminDeletesOwnAccount, UserController.delete); // Deletar um usuário



module.exports = routes