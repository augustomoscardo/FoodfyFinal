const { date } = require('../../lib/utils')
const { unlinkSync} = require('fs')

const Chef = require('../models/Chef')
const File = require('../models/File')

const LoadChefService = require('../services/LoadChefService')
const LoadRecipeService = require('../services/LoadRecipeService')

module.exports = {
  async index(req, res) {
    try {
      let { page, limit } = req.query

      page = page || 1
      limit = limit || 8

      let offset = limit * (page - 1)

      let chefs = await Chef.paginate({ limit, offset })
      
      const chefsPromise = chefs.map(LoadChefService.format)

      chefs = await Promise.all(chefsPromise)

      if (chefs === "") {
        const pagination = { page }

        return res.render('admin/chefs/index', { chefs, pagination })
      }
      
      const pagination = {
        total: Math.ceil(chefs[0].total/limit),
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
      // Create image first
      const files = req.files

      const fileId = await Promise.all(files.map(file => File.create({
        name: file.filename,
        path: file.path
      })))    

      // Create chef and get file_id
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

    try {
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

        // delete previous image
        await deleteFileById(chef.file_id)
      }

      // update without new image
      await Chef.update(req.body.id, {
        name: req.body.name,
      })

      // remove photo from db
      if (req.body.removed_files) {
        // 1,
        const removedFiles = req.body.removed_files.split(",") // [1,]

        const file_id = removedFiles[0]

        await deleteFileById(file_id)
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

      // get image of chef
      const chefFile = await Chef.files(chef.id)

      // can't delete if chef has recipes registered
      if (chef.totalRecipes >= 1) {
      
        return res.send('Chefs que possuem receitas não podem ser deletados')
      } else {

        // remove chef
        await Chef.delete(req.body.id)

        // remove image from public
        unlinkSync(chefFile[0].path)
        
        // remove image from db
        await File.delete(chefFile[0].file_id)


        return res.redirect(`/admin/chefs`)
      }
    } catch (error) {
      console.error(error)   
    }
  },
}