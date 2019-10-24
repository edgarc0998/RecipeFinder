import React from 'react'
// import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from 'react-bootstrap/Navbar'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import axios from 'axios'
import Nav from 'react-bootstrap/Nav'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Home from './components/home'
import SavedRecipes from './components/savedRecipes'

function FormModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.action}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>email</label>
        <input id="emailInput" />
        <label>password</label>
        <input id="passwordInput" />
        <button
          onClick={
            props.action === 'Sign Up'
              ? () => props.signUp()
              : () => props.signIn()
          }
        >
          {props.action}
        </button>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      showModal: false,
      action: '',
      user: {}
    }

    this.signUp = this.signUp.bind(this)
    this.signIn = this.signIn.bind(this)
  }

  async signIn() {
    var email = document.getElementById('emailInput').value
    var password = document.getElementById('passwordInput').value

    try {
      await axios.put('/api/auth/login', {email, password})
      this.setState({showModal: false})
      this.componentDidMount()
    } catch (err) {
      console.error(err)
    }
  }

  async signUp() {
    var email = document.getElementById('emailInput').value
    var password = document.getElementById('passwordInput').value

    try {
      await axios.post('/api/auth/signup', {email, password})
    } catch (err) {
      console.error(err)
    }
  }

  async signOut() {
    try {
      await axios.delete('/api/auth/logout')
      this.componentDidMount()
    } catch (err) {
      console.error(err)
    }
  }

  async componentDidMount() {
    try {
      var me = await axios.get('/api/auth/me')
      this.setState({user: me.data})
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar bg="green" variant="dark" fixed="top">
          <Navbar.Brand href="home">
            <img
              alt=""
              src="/logo192.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Recipe Finder
          </Navbar.Brand>{' '}
          <Nav className="mr-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            {this.state.user.id ? (
              <Nav.Link href="savedRecipes">Saved Recipes</Nav.Link>
            ) : null}
          </Nav>
          <ButtonToolbar>
            {this.state.user.email ? (
              <Button
                style={{boxShadow: '2px 0px 8px #888888'}}
                variant="danger"
                onClick={() => this.signOut()}
              >
                Sign out
              </Button>
            ) : (
              <span id="loginButtonGroup">
                <Button
                  variant="primary"
                  onClick={() =>
                    this.setState({showModal: true, action: 'Sign In'})
                  }
                  variant="primary"
                  style={{boxShadow: '2px 0px 8px #888888'}}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    this.setState({showModal: true, action: 'Sign Up'})
                  }
                  variant="success"
                  style={{boxShadow: '2px 0px 8px #888888'}}
                >
                  Sign Up
                </Button>
              </span>
            )}

            <FormModal
              show={this.state.showModal}
              onHide={() => this.setState({showModal: false})}
              action={this.state.action}
              signUp={this.signUp}
              signIn={this.signIn}
            />
          </ButtonToolbar>
          {/* <Button onClick={async () => await axios.get("/auth/google")}>
            Login with google
          </Button> */}
        </Navbar>

        <Router>
          <Switch>
            {/* {!window.location.href.includes('savedRecipes') ? (
              <Redirect to="/home" />
            ) : (
              <Redirect to="/savedRecipes" />
            )} */}

            <Route exact path="/home">
              <Home user={this.state.user} />
            </Route>

            <Route exact path="/savedRecipes">
              <SavedRecipes />
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
