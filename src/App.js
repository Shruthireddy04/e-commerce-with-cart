import {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  addCartItem = product => {
    const {id} = product
    const {cartList} = this.state
    const alreadyInCart = cartList.filter(i => i.id === id)
    console.log(alreadyInCart)
    if (alreadyInCart.length === 0) {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    } else {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(i => {
          if (i.id === id) {
            return {...i, quantity: i.quantity + product.quantity}
          }
          return i
        }),
      }))
    }
  }

  updateCartItemQuantity = product => {
    const {id} = product

    this.setState(prevState => ({
      cartList: prevState.cartList.map(i => {
        if (i.id === id) {
          return product
        }
        return i
      }),
    }))
  }

  deleteCartItem = id => {
    const {cartList} = this.state
    const newList = cartList.filter(i => i.id !== id)
    this.setState({cartList: newList})
  }

  render() {
    const {cartList} = this.state

    return (
      <BrowserRouter>
        <CartContext.Provider
          value={{
            cartList,
            addCartItem: this.addCartItem,
            deleteCartItem: this.deleteCartItem,
            updateCartItemQuantity: this.updateCartItemQuantity,
          }}
        >
          <Switch>
            <Route exact path="/login" component={LoginForm} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/products" component={Products} />
            <ProtectedRoute
              exact
              path="/products/:id"
              component={ProductItemDetails}
            />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="not-found" />
          </Switch>
        </CartContext.Provider>
      </BrowserRouter>
    )
  }
}

export default App
