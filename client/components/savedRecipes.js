import React from 'react'
import axios from 'axios'
import RecipeCard from './recipeCard'

class SavedRecipes extends React.Component {
  constructor() {
    super()
    this.state = {
      recipes: []
    }
    this.removeRecipe = this.removeRecipe.bind(this)
  }

  async removeRecipe(id) {
    try {
      await axios.delete(`/api/savedRecipes/${id}`)
      this.componentDidMount()
    } catch (err) {
      console.error(err)
    }
  }

  async componentDidMount() {
    try {
      const recipes = await axios.get('/api/savedRecipes/')
      this.setState({recipes: recipes.data})
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    return (
      <div id="savedRecipesPage">
        <div id="savedRecipes">
          {this.state.recipes.length
            ? this.state.recipes.map((elem, idx) => {
                return (
                  <RecipeCard
                    elem={elem}
                    key={idx}
                    saved={true}
                    removeRecipe={this.removeRecipe}
                  />
                )
              })
            : null}
        </div>
      </div>
    )
  }
}

export default SavedRecipes
