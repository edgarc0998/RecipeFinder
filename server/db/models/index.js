var Recipe = require('./recipe')
var User = require('./user')

User.hasMany(Recipe)
Recipe.belongsTo(User)

module.exports = {Recipe, User}
