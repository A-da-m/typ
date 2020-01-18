import { SET_CURRENT_USER, USER_LOADING } from '../actions/types'

const isEmpty = require('is-empty')

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: true
}

export default (state: any = initialState, action: any) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action?.user),
        user: action?.user || null,
        loading: false
      }
    case USER_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state
  }
}
