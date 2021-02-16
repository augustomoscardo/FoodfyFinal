const { compare } = require('bcryptjs')

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


async function profileIndex(req, res, next) {
    const { userId: id} = req.session

    const user = await User.findOne({ where: { id } })

    if (!user) return res.render('admin/users/register', {
        error: "Usuário não encontrado"
    })

    req.user = user

    next()
}

async function profileUpdate(req, res, next) {
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('admin/profile/index', fillAllFields)
    }

    const { userId: id } = req.session  // extract user's id in session
    const { password} = req.body

    if (!password) return res.render('admin/profile/index', {
        user: req.body,
        error: 'Coloque sua senha para atualizar seu cadastro'
    })

    const user = await User.findOne({ where: { id } })

    const passed = await compare(password, user.password)

    if (!passed) return res.render('admin/profile/index', {
        user: req.body,
        error: "Senha incorreta."
    })

    req.user = user  

    next()
}


module.exports = {
    profileIndex,
    profileUpdate
}