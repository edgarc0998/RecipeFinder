import React from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import axios from 'axios'

export default class RecipeCard extends React.Component {
  constructor() {
    super()
    this.viewRecipe = this.viewRecipe.bind(this)
  }

  async viewRecipe(id) {
    try {
      var result = await axios({
        method: 'GET',
        url: `https://api.spoonacular.com/recipes/${id}/information?apiKey=247d11839b7b4caa95dce7ed75300c2f`,
        params: {}
      })
      return result.data.sourceUrl
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    return (
      <Card id="recipeCard">
        <Card.Img
          variant="top"
          src={this.props.elem.image || 'plate.jpeg'}
          height="175"
        />
        <Card.Body>
          <Card.Title>{this.props.elem.title}</Card.Title>
        </Card.Body>
        <div id="cardButtons">
          <Button
            onClick={async () => {
              var url = await this.viewRecipe(this.props.elem.id)
              var win = window.open(url, '_blank')
              win.focus()
            }}
          >
            View Recipe
          </Button>

          {!this.props.saved && this.props.signedIn ? (
            <Button
              onClick={() =>
                this.props.saveRecipe({
                  id: this.props.elem.id,
                  title: this.props.elem.title,
                  image: this.props.elem.image
                })
              }
            >
              Save ⭐
            </Button>
          ) : this.props.saved ? (
            <Button onClick={() => this.props.removeRecipe(this.props.elem.id)}>
              Unsave🗑
            </Button>
          ) : null}
        </div>
      </Card>
    )
  }
}
