const crypto = require("crypto")
const { hash } = require("bcryptjs")
const mailer = require("../../lib/mailer")

const User = require('../models/User')

module.exports = {
    async list(req, res) {

        try {
            const results = await User.all()
            const users = results.rows

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
            // req.session.userId = user.id // adiciando a chave userId no req.session

            const { name, email, is_admin } = req.body
            
            const firstPassword = crypto.randomBytes(5).toString("hex")

            const passwordHash = await hash(firstPassword, 8)

            const user = await User.create({
                name,
                email,
                is_admin: is_admin || false,
                password: passwordHash
            })

            console.log(user);

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodyfy.com.br',
                subject: `Bem vindo ${user.name}!`,
                html: `<h2> Bem vindo ao Foody! </h2>
                <p>Você recebeu seu acesso provisório ao site!</p>
                <p>Esta senha pode ser alterada no futuro se você desejar. Basta solicitar uma recuperação de senha na tela de login</p>

                <h2> Sua senha provisória é: ${firstPassword} </h2>

                <a href="http://localhost:3000/admin/users/login" target="_blank">Faça seu login!</a>
                `
            })

            return res.redirect(`/admin/users/${user.id}/edit`)

        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {

        try {
            const { user } = req

            return res.render("admin/users/edit", { user })

        } catch (error) {
            console.log(error)  
        }
    },
    async update(req, res) {
        try {
            const { user } = req

            const { name, email, is_admin } = req.body
            
            await User.update(user.id, {
                name,
                email,
                is_admin: is_admin || false
            })

            return res.render(`admin/users/edit`, {
                user: req.body,
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
            await User.delete(req.body.id)
            // req.session.destroy()

            return res.render(`admin/users/index`, {
                success: 'Conta deletada com sucesso'
            })

        } catch (error) {
            console.error(error)
            return res.render("admin/users/index", {
                user: req.body,
                error: "Erro ao deletar conta!"
            })   
        }
    },
}