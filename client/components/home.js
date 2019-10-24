import React from 'react'
import RecipeCard from './recipeCard'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import Button from 'react-bootstrap/Button'

class Home extends React.Component {
  constructor() {
    super()

    this.state = {
      currentSearch: '',
      searchString: [],
      results: {},
      hasMore: false,
      offset: 10
    }

    this.findRecipes = this.findRecipes.bind(this)
    this.removeFromSearch = this.removeFromSearch.bind(this)
    this.saveRecipe = this.saveRecipe.bind(this)
  }

  async saveRecipe(recipe) {
    try {
      await axios.post('/api/savedRecipes/', recipe)
    } catch (err) {
      console.error(err)
    }
  }

  async findRecipes(offset = 0, loadMore) {
    var newStr = ''
    if (
      this.state.searchString.length > 0 &&
      this.state.currentSearch.length > 0
    ) {
      newStr =
        this.state.searchString.join(',') + ',' + this.state.currentSearch
    } else if (
      this.state.currentSearch === '' &&
      this.state.searchString.length > 0
    ) {
      newStr = this.state.searchString.join(',')
    } else {
      newStr = this.state.currentSearch
    }

    if (newStr.length > 0) {
      try {
        var results = await axios({
          method: 'GET',
          url:
            'https://api.spoonacular.com/recipes/findByIngredients?apiKey=247d11839b7b4caa95dce7ed75300c2f',
          params: {
            number: 10,
            ingredients: newStr,
            offset: offset
          }
        })
      } catch (err) {
        console.error(err)
      }

      var newState = {}
      if (loadMore) {
        newState.results = this.state.results.concat(results.data)
      } else {
        newState.results = results.data
      }
      newState.currentSearch = ''
      if (this.state.currentSearch !== '') {
        newState.searchString = [
          ...this.state.searchString,
          this.state.currentSearch
        ]
      }
      this.setState(newState)
    } else {
      this.setState({results: {}})
    }
  }

  fetchMoreData = () => {
    setTimeout(() => {
      this.findRecipes(this.state.offset + 5, true)
      this.setState({offset: this.state.offset + 5})
    }, 1000)
  }

  async removeFromSearch(word) {
    var newSearch = [...this.state.searchString]
    newSearch = newSearch.filter(elem => {
      if (elem !== word) {
        return elem
      }

    })

    var newState = {}
    newState.searchString = newSearch

    if (newSearch.length === 0) {
      newState.results = {}
    }

    await this.setState(newState)
    this.findRecipes()
  }

  render() {
    var recipes = []
    if (this.state.results.length > 0) {
      recipes = this.state.results
    }
    return (
      <div id="home">
        <div id="sideMenu">
          <div id="currentIngredientsLabel">Your Ingredients</div>
          <div id="search">
            <input
              id="searchInput"
              value={this.state.currentSearch}
              onChange={() =>
                this.setState({
                  currentSearch: document.getElementById('searchInput').value
                })
              }
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => this.findRecipes()}
            >
              Add
            </Button>
          </div>

          <div id="currentIngredients">
            {this.state.searchString.length < 1
              ? null
              : this.state.searchString.map((word, idx) => {
                  return (
                    <div
                      id="searchString"
                      key={idx}
                      onClick={() => this.removeFromSearch(word)}
                    >
                      <h4>{word}</h4>
                    </div>
                  )
                })}
          </div>
        </div>

        <div id="sideContent">
          {!this.state.results.length ? (
            <div id="instructions">
              <h1>
                Search for recipes by typing in ingredients you currently have!
              </h1>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={this.state.results.length}
              next={this.fetchMoreData}
              hasMore={this.state.hasMore}
              loader={<h1>Loading</h1>}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              <div id="results">
                {recipes.map((elem, idx) => {
                  return (
                    <RecipeCard
                      elem={elem}
                      saveRecipe={this.saveRecipe}
                      key={idx}
                      signedIn={!!this.props.user.id}
                    />
                  )
                })}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    )
  }
}

export default Home
