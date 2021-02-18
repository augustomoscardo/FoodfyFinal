const Recipe = require('../models/Recipe')

async function checkCredential(req, res, next) {
    const recipe = await Recipe.findOne({ where: { id: req.params.id }})
    console.log(recipe);

    console.log(req.session);
    if (recipe.user_id != req.session.userId) {
        // req.session.error = "Você não possui permissão para alterar as receitas de outros usuários"
        
        // return res.redirect(`/admin/recipes/${recipe.id}`)
        return res.render(`admin/recipes/show`, {
            recipe,
           error: "Você não possui permissão para alterar as receitas de outros usuários"
        })


    }
    next()
}


module.exports = {
    checkCredential
}