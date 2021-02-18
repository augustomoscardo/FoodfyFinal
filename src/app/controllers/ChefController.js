const { date } = require('../../lib/utils')
const { unlinkSync} = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')
const RecipeFile = require('../models/RecipeFile')
const Recipe = require('../models/Recipe')

const LoadChefService = require('../services/LoadChefService')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {

        try {
            // const chefs = await LoadChefService.load('chefs')

            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6

            let offset = limit * (page - 1)

            let chefs = await Chef.paginate({ page, limit, offset })
            const chefsPromise = chefs.map(LoadChefService.format)

            chefs = await Promise.all(chefsPromise)

            // if (chefs = "") {
            //     const pagination = { page }

            //     return res.render('admin/chefs/index', { chefs, pagination })
            // }

            console.log(chefs);
            
            const pagination = {
                total: Math.ceil(chefs[0].total/limit),
                page
            }


            // let results = await Chef.all()
            // const chefs = results.rows


            // const chefWithImage = await Promise.all(chefs.map( async chef => {
            //     const fileResults = await Chef.find(chef.id) // trazendo os chefs
            //     const fileId = fileResults.rows[0].file_id // pegando o id da imagem dentro de chef
                
            //     const imageResults = await File.find(fileId) // trazendo as imagens 
            //     const image = imageResults.rows[0].path // acessando a propriedade path das imagens

            //     return {
            //         ...chef,
            //         image: `${req.protocol}://${req.headers.host}${image.replace("public", "")}`
            //     }
            // }))
            return res.render('admin/chefs/index', { chefs, pagination })

        } catch (error) {
            console.log(error)
        }

    },
    create(req, res) {
    
        return res.render('admin/chefs/create')
    },
    async post(req, res) {

        try {
            // Criar a imagem primeiro, pois quando eu crio o chef é nele que eu pego a imagem.
            const files = req.files
            console.log(files);
            const fileId = await File.create({
                name: files[0].filename,
                path: files[0].path
            })
            console.log(fileId);

            const chef = await Chef.create({
               name: req.body.name,
               file_id: fileId,
               created_at: date(Date.now()).iso
            })
            console.log(chef);
            
            return res.redirect(`/admin/chefs/${chef}`)

        } catch (error) {
            console.log(error)
        }
    },
    async show(req, res) {

        try {
            const chef = await LoadChefService.load("chef", { where: { id: req.params.id }})

            const chefRecipes = await LoadRecipeService.load("recipes", { where: { chef_id: req.params.id }})

            return res.render("admin/chefs/show", { chef, chefRecipes })

        } catch (error) {
            console.log(error)
        }
    },
    async edit(req, res) {

        try {
            const chef = await LoadChefService.load("chef", {where: { id: req.params.id}})

            return res.render("admin/chefs/edit", { chef })

        } catch (error) {
            console.log(error) 
        }
    },
    async put(req, res) {

        try {
            // const keys = Object.keys(req.body)

            // for (key of keys) {
            //     if (req.body[key] == "" && key != "removed_files") {
            //         return res.send('Please fill all fields!')
            //     }
            // }

            const file = req.files

            // get new image
            if (file.length != 0) {
                const fileId = await File.create({
                    name: file.filename,
                    path: file.file.path
                })

                await Chef.update(req.body.id, {
                    name: req.body.name,
                    file_id: fileId
                })
            }

            await Chef.update(req.body.id, {
                name: req.body.name,
            })

            // remove photo from db
            if (req.body.removed_files) {
                // 1,
                const removedFile = req.body.removed_files.split(",") // [1,]

                const file_id = removedFile[0]

                const file = await File.findOne({ where: { id: file_id }})

                unlinkSync(file.path)

                await File.delete(file_id)

                console.log(file_id);
            }

            return res.redirect(`/admin/chefs/${req.body.id}`)

        } catch (error) {
            console.error(error);          
        }
    },
    async delete(req, res) {

        try {
            // finding chef
            const chef = await Chef.findOne({ where: { id }})

            // get image of chef
            const chefFile = await Chef.files(chef.file_id)

            // can't delete if chef has recipes registered
            if (chef.totalRecipes >= 1) {
                
                return res.send('Chefs que possuem receitas não podem ser deletados')
            } else {
                unlinkSync(chefFile[0].path)
                
                await Chef.delete(req.body.id)

                await File.delete(chefFile[0].id)

                return res.redirect(`/admin/chefs`)
            }
        } catch (error) {
            console.error(error)   
        }
    },
}