const { unlinkSync} = require('fs')


const Chef = require('../models/Chef')


async function post(req, res, next) {
    try {
        const chefsSelectOptions = await Chef.findAll()

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] === "") {

                req.files.map(file => unlinkSync(file.path)) // delete img from public if error

                return res.render('admin/recipes/create',  {
                    recipe: req.body,
                    chefsSelectOptions,
                    error: 'Por favor, preencha todos os campos'
                    
                })
            }
        }

        if (!req.files || req.files.length === 0) 
            return res.render('admin/recipes/create', {
                recipe: req.body,
                chefsSelectOptions,
                error: "Por favor envie pelo menos uma imagem."
            })

        next()
    } catch (error) {
        console.error(error);
    }
}

async function update(req, res, next) {
    try {
        const chefsSelectOptions = await Chef.findAll()

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] === "" && key !== "removed_files") {
                return res.render('admin/recipes/edit', {
                    recipe: req.body,
                    chefsSelectOptions,
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