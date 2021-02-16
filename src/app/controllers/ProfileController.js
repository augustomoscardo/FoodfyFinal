const User = require('../models/User')

module.exports ={
    index(req, res) {
        const { user } = req

        return res.render('admin/profile/index', { user })
    },
    async update(req, res) {
        try {
            const { user } = req
            const { name, email } = req.body

            await User.update(user.id, {
                name,
                email
            })

            return res.render('admin/profile/index', {
                user: req.body,
                success: "Conta atualizada com sucesso"
            })
        } catch (error) {
            console.error(error);
            return res.render('admin/profile/index', {
                user:req.body,
                error: "Algum erro aconteceu."
            })
        }
    }
}