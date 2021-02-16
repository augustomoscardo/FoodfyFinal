const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

const User = require('../models/User')

module.exports = {
    loginForm(req, res) {

        return res.render('admin/session/login')
    },
    login(req, res) {

        const { user , session } = req
        
        session.userId = user.id
        session.isAdmin = user.is_admin

        return res.render('admin/profile/index', { user })
    },
    logout(req, res) {
        req.session.destroy()
        
        return res.redirect('/')
    },
    forgotForm(req, res) {

        return res.render('admin/session/forgot-password')
    },
    async forgot(req, res) {

        const user = req.user

        try {
            // token for user
            const token = crypto.randomBytes(20).toString("hex")

            // create token`s expiration based on date
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // send email with a link for password recover
            await mailer.sendMail({
                to: user.email,     
                from: 'no-reply@foodyfy.com.br', 
                subject: 'Recuperação de Senha',
                html: `<h2>Esqueceu sua senha?</h2>   
                <p> Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/admin/users/reset-password?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `
            })

            // notify user that an email has been sent
            return res.render('admin/session/forgot-password', {
                success: 'Verifique sua caixa de email para recuperar sua senha!'
            })

        } catch (error) {
            console.error(error)
            return res.render('admin/session/forgot-password', {
                error: 'Erro inesperado, tente novamente!'
            })
        }
    },
    resetForm(req, res) {

        return res.render('admin/session/reset-password', {
            token: req.query.token
        })
    },
    async reset(req, res) {

        const user = req.user

        const { password, token } = req.body

        try {
            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            return res.render('admin/session/login', {
                user: req.body,
                success: "Senha atualizada com sucesso! Faça seu login."
            })
            
        } catch (error) {
            console.error(error)
            return res.render('admin/session/reset-password', {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente!"
            })
        }
    }
}