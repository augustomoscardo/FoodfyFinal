async function post(req, res, next) {
    try {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.render('admin/chefs/create', {
                    chef: req.body,
                    error: 'Por favor, preencha todos os campos'
                })
            }
        }

        if (!req.files || req.files.length == 0) 
            return res.render('admin/chefs/create', {
                chef: req.body,
                error: "Por favor envie pelo menos uma imagem."
        })

        next()
    } catch (error) {
        console.error(error);
    }
}

async function update(req, res, next) {
    try {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.render(`admin/chefs/edit`, {
                    chef: req.body,
                    error: 'Por favor, preencha todos os campos'
                })
            }
        }


    } catch (error) {
        console.error(error);
    }


    next()
}


module.exports = {
    post,
    update
}