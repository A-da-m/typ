import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchState } from '../redux/actions/auth'

const PrivateRoute = ({ component: Component, isAuthenticated, loading, ...rest }: any) => (
  <Route
    {...rest} render={props => loading || isAuthenticated ? (<Component {...props} />) : (<Redirect to='/' />)}
  />
)

fetchState()

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated || false,
  loading: state.auth.loading || false
})

export default connect(mapStateToProps, { fetchState })(PrivateRoute)
