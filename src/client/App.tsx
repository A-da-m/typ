import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { fetchState } from './redux/actions/auth'
import PrivateRoute from './components/PrivateRoute'
import { Provider } from 'react-redux'
import store from './redux/store'

import 'react-bulma-components/dist/react-bulma-components.min.css'
import '../../public/scss/index.scss'

import Sidebar from './components/sidebar'
import Navbar from './components/navbar'

const Bots = React.lazy(() => import('./pages/bots'))
const Servers = React.lazy(() => import('./pages/servers'))
const Privacy = React.lazy(() => import('./pages/privacy'))
const Terms = React.lazy(() => import('./pages/terms'))
const Bot = React.lazy(() => import('./pages/bot'))
const Add = React.lazy(() => import('./pages/add'))

// @ts-ignore
store.dispatch(fetchState())

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Router>
          <Navbar />
          <div className='App columns is-fullheight'>
            <Sidebar />
            <Switch>
              <React.Suspense fallback={<div></div>}>
                <Route exact component={Bots} path='/' />
                <Route exact component={Servers} path='/servers' />
                <Route exact component={Privacy} path='/privacy' />
                <Route exact component={Terms} path='/terms' />
                <Route exact component={Bot} path='/bot/:id' />
                <Route exact component={Add} path='/bot' />
              </React.Suspense>
            </Switch>
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
