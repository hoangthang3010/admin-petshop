import axios from 'axios'
// import queryString from 'querystring'
import {API_URL} from '../.env.js'

const Repository = axios.create({
  baseURL: API_URL,
  headers: {"Authorization": "Bearer yourToken"}
//   paramsSerializer: params => queryString.stringify(params),
})

// axiosClient.interceptors.response.use( response => {
//    if (response && response.data) {
//      return response.data
//    }
//    return response
// }, (error) => {
//   throw error
// })

export default Repository
