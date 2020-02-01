import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchState } from '../redux/actions/auth'

const PrivateRoute = ({ component: Component, isAuthenticated, user, loading, ...rest }: any) => (
  <Route
    {...rest} render={props => loading ? (<></>) : (rest.admin ? isAuthenticated && user.admin : isAuthenticated) ? (<Component {...props} />) : (<Redirect to='/' />)}
  />
)

fetchState()

const mapStateToProps = (state: any) => ({
  user: state.auth.user || null,
  isAuthenticated: state.auth.isAuthenticated || false,
  loading: state.auth.loading || false
})

export default connect(mapStateToProps, { fetchState })(PrivateRoute)
