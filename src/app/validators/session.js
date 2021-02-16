const { compare } = require('bcryptjs')

const User = require('../models/User')

async function login(req, res, next) {
    try {
        const { email, password } = req.body

        // get user by email
        const user = await User.findOne({ where: { email } })

        // check if user is registered
        if (!user) return res.render('admin/session/login', {
            user: req.body,
            error: "Usuário não cadastrado!"
        })

        // check if password match
        const passed = await compare(password, user.password)

        if (!passed) return res.render('admin/session/login', {
            user: req.body,
            error: "Senha incorreta!"
        })

        // add user in req.session
        req.user = user

        next()
    } catch (error) {
        console.error(error);
    }
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        // get user by email
        let user = await User.findOne({ where: { email } })

        // check if user email is registered
        if (!user) return res.render('admin/session/forgot-password', {
            user: req.body,
            error: "Email não cadastrado"
        })

        req.user = user

        next()

    } catch (error) {
        console.error(error);
    }
}

async function reset(req, res, next) {
    try {
        const { email, password, passwordRepeat, token } = req.body
        
        // get user by email
        const user = await User.findOne({ where: { email } })

        // check if user existis
        if (!user) return res.render('admin/session/reset-password', {
            user: req.body,
            token,
            error: "Usuário não encontrado"
        })

        // check if password match
        if (password != passwordRepeat) return res.render('admin/session/reset-password', {
            user: req.body,
            token,
            error: "A sua senha não confere!"
        })

        // check if token match
        if (token != user.reset_token) return res.render('admin/session/reset-password', {
            user: req.body,
            token,
            error: "Token inválido! Por favor, solicite uma nova recuperação de senha."
        })
        
        // check if token is not expired
        let now = new Date()
        now = now.setHours(now.getHours())

        if (now > user.reset_token_expires) return res.render('admin/session/reset-password', {
            user: req.body,
            token,
            error: "Token inválido! Por favor, solicite uma nova recuperação de senha."
        })

        req.user = user

        next()

    } catch (error) {
        console.error(error);
        return res.render('admin/session/reset-password', {
            user: req.body,
            token,
            error: "Algum erro aconteceu!"
        })
    }
}


module.exports = {
    login,
    forgot,
    reset
}