const router = require('express').Router()
const {Recipe} = require('../db/models/index')

router.post('/', async (req, res, next) => {
  try {
    const newRecipe = await Recipe.create({
      id: req.body.id,
      image: req.body.image,
      title: req.body.title,
      userId: req.user.id
    })

    res.send(newRecipe)
  } catch (err) {
    console.error(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const allRecipes = await Recipe.findAll({
      where: {
        userId: req.user.id
      }
    })
    res.send(allRecipes)
  } catch (err) {
    console.error(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({
      where: {
        userId: req.user.id,
        id: req.params.id
      }
    })

    await recipe.destroy()
    res.send('Deleted')
  } catch (err) {
    console.error(err)
  }
})

module.exports = router
