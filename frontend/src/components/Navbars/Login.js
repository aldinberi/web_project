import React from 'react'
import qs from 'query-string'

const Login = (props) => {
    console.log(props.location.search)
    let params = qs.parse(props.location.search)
    window.localStorage.setItem('token', params['token'])
}

export default Login