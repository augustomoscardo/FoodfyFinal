// const { compare } = require('bcryptjs')

const User = require('../models/User')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos'
            }
        }
    }
}

async function post(req, res, next) {
    try {
        //check if has all fields
        const fillAllFields = checkAllFields(req.body)

        if (fillAllFields) {
            return res.render('admin/users/register', fillAllFields)
        }

        //check if user exists [email]
        const { email } = req.body

        const user = await User.findOne({ where: { email } })

        if (user) return res.render('admin/users/register', {
            user: req.body,
            error: 'Usuário já cadastrado!'
        })

        next()
    } catch (error) {
        console.error(error);
    }
}

async function edit(req, res, next) {
    try {
        const { id } = req.params

        const user = await User.findOne({ where: { id } })

        if (!user) return res.render('admin/users/register', {
            error: "Usuário não encontrado!"
        })

        req.user = user

        next()
    } catch (error) {
        console.error(error);
    }
}

async function update(req, res, next) {

    //check if has all fields
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/users/edit', fillAllFields)
    }

    const { id } = req.body

    const user = await User.findOne({ where: { id } })

    req.user = user  

    next()
}


async function AdminDeletesOwnAccount(req, res, next) {
    const { userId } = req.session

    const { id } = req.body

    const user = await User.findOne({ where: { id } })

    if (userId == id) {  // verificar se id do user da sessão é igual ao id do user do body
        return res.render('admin/users/index', {
            user,
            error: "Desculpe! Você não pode deletar sua própria conta."
        })
    }

    next()
}

module.exports = {
    post,
    edit,
    update,
    AdminDeletesOwnAccount
}