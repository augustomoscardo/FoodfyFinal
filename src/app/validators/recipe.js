const Recipe = require('../models/Recipe')


async function post(req, res, next) {
    try {
        let results = await Recipe.chefsSelectOptions()
        const chefOptions = results.rows 

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.render('admin/recipes/create', {
                    recipe: req.body,
                    chefOptions,
                    error: 'Por favor, preencha todos os campos'
                })
            }
        }

        if (!req.files || req.files.length == 0) 
            return res.render('admin/recipes/create', {
                recipe: req.body,
                chefOptions,
                error: "Por favor envie pelo menos uma imagem."
            })

        next()
    } catch (error) {
        console.error(error);
    }
}

async function update(req, res, next) {
    try {
        let results = await Recipe.chefsSelectOptions()
        const chefOptions = results.rows

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.render('admin/recipes/edit', {
                    recipe: req.body,
                    chefOptions,
                    error: 'Por favor, preencha todos os campos'
                })
            }
        }

        next()
    } catch (error) {
        console.error();
    }
}


module.exports = {
    post,
    update
}