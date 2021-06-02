const User = require('../models/User')

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

async function userIsAdmin(req, res, next) {
  const user = await User.findOne({ where: { id: req.session.userId }})

  if (!req.session.isAdmin) return res.render('admin/profile/index', {
    user,
    error: "Essa área é restrita para administradores!"
  })

  next()
}

module.exports = {
  onlyUsers,
  userIsLogged,
  userIsAdmin
}