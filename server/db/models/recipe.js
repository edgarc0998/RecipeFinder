const Sequelize = require('sequelize')
const db = require('../db')

const Recipe = db.define('recipe', {
  image: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  }
})

module.exports = Recipe
