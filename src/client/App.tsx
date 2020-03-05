import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { fetchState } from './redux/actions/auth'

import { Provider } from 'react-redux'
import store from './redux/store'

// import 'react-bulma-components/dist/react-bulma-components.min.css'
import '../../public/scss/index.scss'

import Sidebar from './components/sidebar'
import Navbar from './components/navbar'
import Private from './components/private'

const Bots = React.lazy(() => import('./pages/bots'))
const Servers = React.lazy(() => import('./pages/servers'))
const Privacy = React.lazy(() => import('./pages/privacy'))
const Terms = React.lazy(() => import('./pages/terms'))
const Bot = React.lazy(() => import('./pages/bot'))
const Add = React.lazy(() => import('./pages/add'))
const User = React.lazy(() => import('./pages/user'))
const Manage = React.lazy(() => import('./pages/manage'))
const Queue = React.lazy(() => import('./pages/queue'))

// @ts-ignore
store.dispatch(fetchState())

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Router>
          <Navbar />
          <div>
            <Sidebar />
            <div className='typ-main'>
              <Switch>
                <React.Suspense fallback={<div></div>}>
                  <Route exact component={Bots} path='/' />
                  <Route exact component={Servers} path='/servers' />
                  <Route exact component={Servers} path='/search' />
                  <Route exact component={Privacy} path='/privacy' />
                  <Route exact component={Terms} path='/terms' />
                  <Route exact component={User} path='/user/:id' />
                  <Route exact component={Bot} path='/bot/:id' />
                  <Private exact component={Add} path='/bot' />
                  <Private exact component={Manage} path='/bot/:id/manage' />
                  <Private exact admin component={Queue} path='/queue' />
                </React.Suspense>
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
