import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { useField } from '../hooks'
import loginService from '../services/login'
import { initializeBlogs } from '../reducers/blogReducer'
import { setToken, setUser } from '../reducers/loginReducer'
import { setNotification } from '../reducers/notificationReducer'

import { Form, Button, Input } from 'semantic-ui-react'
import styles from '../style/styles'

const LoginForm = (props) => {
  const username = useField('text')
  const password = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()
    const credentials = {
      username: username.value,
      password: password.value,
    }
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      props.setToken(user.token)
      props.setUser(user)
      props.initializeBlogs()
    } catch (exception) {
      username.setValue('')
      password.setValue('')
      console.log('exception', exception)
      props.setNotification({ error: 'wrong credentials' }, 5)
    }
  }

  return (
    <>
    <h2>Login</h2>
      <Form onSubmit={handleLogin} className='login-form'>
        <Form.Group>
          <Form.Input
              required
              label="Username"
              id='username'
              type={username.type}
              value={username.value}
              onChange={username.onChange}
          />
          <Form.Input
              required
              label="Password"
              id='password'
              type={password.type}
              value={password.value}
              onChange={password.onChange}
          />
        </Form.Group>
        <Form.Button type='submit' style={styles.button}>Login</Form.Button>
      </Form>
    </>
  )
}

const mapDispatchToProps =   {
  initializeBlogs,
  setNotification,
  setToken,
  setUser,
}

LoginForm.propTypes = {
  initializeBlogs: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
}

export default connect(
  null,
  mapDispatchToProps
)(LoginForm)