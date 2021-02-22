const crypto = require("crypto")
const mailer = require("../../lib/mailer")
const { hash } = require("bcryptjs")
const { unlinkSync } = require('fs')
const { date } = require('../../lib/utils')


const User = require('../models/User')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
    async list(req, res) {

        try {
            const users = await User.findAll()

            return res.render('admin/users/index', { users })

        } catch (error) {
            console.error(error)
        }
    },
    registerForm(req, res) {
    
        return res.render('admin/users/register')
    },
    async post(req, res) {

        try {            

            const { name, email } = req.body

            let is_admin = req.body.is_admin && JSON.parse(req.body.is_admin) //make sure is_admin is a boolean
          
            const firstPassword = crypto.randomBytes(5).toString("hex")

            const passwordHash = await hash(firstPassword, 8)

            const user = await User.create({
                name,
                email,
                is_admin: is_admin || false,
                password: passwordHash,
                created_at: date(Date.now()).iso
            })

            // req.session.userId = user // add key userId un req.session

            await mailer.sendMail({
                to: email,
                from: 'no-reply@foodyfy.com.br',
                subject: `Bem vindo ${name}!`,
                html: `<h2> Bem vindo ao Foody! </h2>
                <p>Você recebeu seu acesso provisório ao site!</p>
                <p>Esta senha pode ser alterada no futuro se você desejar. Basta solicitar uma recuperação de senha na tela de login</p>

                <h2> Sua senha provisória é: ${firstPassword} </h2>

                <a href="http://localhost:3000/admin/users/login" target="_blank">Faça seu login!</a>
                `
            })

            return res.redirect(`/admin/users/${user}/edit`)

        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {

        try {
            const { user } = req

            return res.render("admin/users/edit", { user })

        } catch (error) {
            console.error(error)  
        }
    },
    async update(req, res) {
        try {
            const { user } = req

            const { name, email } = req.body

            let is_admin = req.body.is_admin && JSON.parse(req.body.is_admin) //make sure is_admin is a boolean

            await User.update(user.id, {
                name,
                email,
                is_admin: is_admin || false
            })

            return res.render(`admin/users/edit`, {
                user: { ...req.body, is_admin },
                success: 'Conta atualizada com sucesso'
            })

        } catch (error) {
            console.error(error)
            return res.render(`admin/users/edit`, {
                user: req.body,
                error: 'Algum erro aconteceu.'
            })         
        }
    },
    async delete(req, res) {   
        try {
            // pegar todas as receitas do usuário
            const recipesOfUser = await Recipe.findAll({ where: { user_id: req.body.id } })
         
            // das receitas, pegar todas as receitas
            const recipesFilesPromise = recipesOfUser.map(recipe => Recipe.files(recipe.id))

            let recipesFiles = await Promise.all(recipesFilesPromise)

            // rodar remoção do usuário
            await User.delete(req.body.id)
                
            // remover as imagens da pasta public
            recipesFiles.map(files => {
                files.map(file => {
                    try {
                        unlinkSync(file.path)

                        File.delete(file.file_id)
                    } catch (error) {
                        console.error(error);
                    }
                })
            })

            await Promise.all(recipesFiles)

            const users = await User.findAll()

            return res.render(`admin/users/index`, {
                users,
                success: 'Conta deletada com sucesso'
            })

        } catch (error) {
            console.error(error)
            return res.render("admin/users/index", {
                user: req.body,
                error: "Erro ao deletar conta!"
            })   
        }
    }
}