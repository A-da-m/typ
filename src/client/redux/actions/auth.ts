import { SET_CURRENT_USER, USER_LOADING } from './types'
import axios from 'axios'

export const fetchState = () => (dispatch: any): Promise<any> => {
  dispatch({
    type: USER_LOADING
  })
  return axios
    .get('/auth/state')
    .then(user => dispatch({
      type: SET_CURRENT_USER,
      user: user?.data || undefined
    }))
    .catch(err => console.error(err))
}
