const { date } = require('../../lib/utils')
const { unlinkSync} = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

const LoadChefService = require('../services/LoadChefService')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
    async index(req, res) {

        try {
            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6

            let offset = limit * (page - 1)

            let chefs = await Chef.paginate({ page, limit, offset })
            
            const chefsPromise = chefs.map(LoadChefService.format)

            chefs = await Promise.all(chefsPromise)

            if (chefs === "") {
                const pagination = { page }

                return res.render('admin/chefs/index', { chefs, pagination })
            }
            
            const pagination = {
                total: Math.ceil(chefs.length/limit),
                page
            }
            
            return res.render('admin/chefs/index', { chefs, pagination })

        } catch (error) {
            console.error(error)
        }

    },
    create(req, res) {
    
        return res.render('admin/chefs/create')
    },
    async post(req, res) {

        try {
            // Criar a imagem primeiro, pois quando eu crio o chef é nele que eu pego a imagem.
            const files = req.files

            const fileId = await Promise.all(files.map(file => File.create({
                name: file.filename,
                path: file.path
            })))    


            const chef = await Chef.create({
               name: req.body.name,
               file_id: fileId[0],
               created_at: date(Date.now()).iso
            })

            
            return res.redirect(`/admin/chefs/${chef}`)

        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {

        try {
            const chef = await LoadChefService.load("chef", { where: { id: req.params.id }})

            const chefRecipes = await LoadRecipeService.load("recipes", { where: { chef_id: req.params.id }})

            return res.render("admin/chefs/show", { chef, chefRecipes })

        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {

        try {
            const chef = await LoadChefService.load("chef", {where: { id: req.params.id}})

            return res.render("admin/chefs/edit", { chef })

        } catch (error) {
            console.error(error) 
        }
    },
    async put(req, res) {

        const chef = await Chef.findOne({ where: { id: req.body.id }})
console.log(chef);
        try {
            // const keys = Object.keys(req.body)

            // for (key of keys) {
            //     if (req.body[key] == "" && key != "removed_files") {
            //         return res.send('Please fill all fields!')
            //     }
            // }

            const files = req.files

            async function deleteFileById(id) {
                const file = await File.findOne({ where: { id }})

                unlinkSync(file.path)

                await File.delete(id)
            }

            // get new image
            if (files.length !== 0) {
                const fileId = await Promise.all(files.map(file => File.create({
                    name: file.filename,
                    path: file.path
                })))

                await Chef.update(req.body.id, {
                    name: req.body.name,
                    file_id: fileId[0]
                })

                await deleteFileById(chef.file_id)
            }

            await Chef.update(req.body.id, {
                name: req.body.name,
            })

            // remove photo from db
            if (req.body.removed_files) {
                // 1,
                const removedFiles = req.body.removed_files.split(",") // [1,]

                const file_id = removedFiles[0]

                await deleteFileById(file_id)

                console.log(file_id);
            }

            return res.redirect(`/admin/chefs/${req.body.id}`)

        } catch (error) {
            console.error(error);          
        }
    },
    async delete(req, res) {

        try {
            // find chef
            const chef = await Chef.findOne({ where: { id: req.body.id }})

            // console.log({chef});

            // get image of chef
            const chefFile = await Chef.files(chef.id)
            console.log({chefFile});

            // can't delete if chef has recipes registered
            if (chef.totalRecipes >= 1) {
                
                return res.send('Chefs que possuem receitas não podem ser deletados')
            } else {

                await Chef.delete(req.body.id)

                unlinkSync(chefFile[0].path)
                
                
                await File.delete(chefFile[0].file_id)


                return res.redirect(`/admin/chefs`)
            }
        } catch (error) {
            console.error(error)   
        }
    },
}