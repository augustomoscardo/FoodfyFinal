function onlyUsers(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/admin/users/login')

    next()
}

function userIsLogged( req, res, next) {
    if (req.session.userId) 
        return res.redirect('admin/profile/index')

    next()
}

function userIsAdmin(req, res, next) {
    // if (req.session.isAdmin == false) return res.render('admin/users', {
    //     error: "Essa área é restrita para administradores!"
    // })

    if (!req.session.isAdmin) return res.render('admin/users/index', {
        error: "Essa área é restrita para administradores!"
    })

    next()
}

module.exports = {
    onlyUsers,
    userIsLogged,
    userIsAdmin
}