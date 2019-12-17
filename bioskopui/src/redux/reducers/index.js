// //#10
import {combineReducers} from 'redux'
import AuthReducers from './AuthReducers'

export default combineReducers({ // //menggabungkan reducers
    Auth:AuthReducers
})