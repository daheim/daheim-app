import React, {PropTypes, Component} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import Helmet from 'react-helmet'
import {FormattedMessage, injectIntl} from 'react-intl'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import {changePassword} from '../../actions/auth'

class ChangePasswordPage extends Component {

  state = {
    password: '',
    passwordError: null,
    newPassword: '',
    newPasswordError: null,
    repeatNewPassword: '',
    repeatNewPasswordError: null,
    errorMessage: null,
    running: false
  }

  componentDidMount () {
    if (this.refs.password) this.refs.password.focus()
  }

  handlePasswordChange = (e) => {
    this.setState({password: e.target.value})
  }

  handleNewPasswordChange = (e) => {
    this.setState({newPassword: e.target.value})
  }

  handleRepeatNewPasswordChange = (e) => {
    this.setState({repeatNewPassword: e.target.value})
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    const {password, newPassword, repeatNewPassword, running} = this.state
    const {intl, push} = this.props

    if (running) return

    let error = false
    const errors = {
      passwordError: null,
      newPasswordError: null,
      repeatNewPasswordError: null,
      errorMessage: null
    }
    if (!password) {
      error = true
      errors.passwordError = intl.formatMessage({id: 'changePasswordPage.requiredField'})
    }
    if (!newPassword) {
      error = true
      errors.newPasswordError = intl.formatMessage({id: 'changePasswordPage.requiredField'})
    }
    if (newPassword !== repeatNewPassword) {
      error = true
      errors.repeatNewPasswordError = intl.formatMessage({id: 'changePasswordPage.newPasswordMismatch'})
    }
    this.setState(errors)
    if (error) return

    let success = false
    this.setState({running: true})
    try {
      await this.props.changePassword({
        username: this.props.profile.username,
        password,
        newPassword,
        repeatNewPassword
      })
      success = true
    } catch (err) {
      if (err.code === 'unauthorized') {
        this.setState({errorMessage: this.props.intl.formatMessage({id: 'loginPage.invalidPassword'})})
      } else {
        this.setState({errorMessage: err.message})
      }
    } finally {
      this.setState({running: false})
    }

    if (success) push('/')
  }

  render () {
    const {intl, profile} = this.props
    const {password, passwordError, newPassword, newPasswordError,
      repeatNewPassword, repeatNewPasswordError, errorMessage, running} = this.state

    return (
      <div style={{padding: '16px 16px'}}>
        <Helmet title={intl.formatMessage({id: 'changePasswordPage.title'})} />
        <h1><FormattedMessage id='changePasswordPage.title' /></h1>
        <form noValidate onSubmit={this.handleSubmit} className='loginForm'>
          <div style={{maxWidth: 300}}>
            <TextField readOnly className='email' type='email' fullWidth floatingLabelText={intl.formatMessage({id: 'forgotPasswordPage.emailAddressLabel'})} value={profile.username} />
            <TextField className='password' ref='password' type='password' errorText={passwordError} fullWidth floatingLabelText={intl.formatMessage({id: 'changePasswordPage.currentPassword'})} value={password} onChange={this.handlePasswordChange} />
            <TextField className='newPassword' type='password' fullWidth errorText={newPasswordError} floatingLabelText={intl.formatMessage({id: 'changePasswordPage.newPassword'})} value={newPassword} onChange={this.handleNewPasswordChange} />
            <TextField className='repeatNewPassword' type='password' fullWidth errorText={repeatNewPasswordError} floatingLabelText={intl.formatMessage({id: 'changePasswordPage.repeatNewPassword'})} value={repeatNewPassword} onChange={this.handleRepeatNewPasswordChange} />
          </div>
          <RaisedButton disabled={running} className='submit' type='submit' style={{marginTop: 20}} primary label={intl.formatMessage({id: 'changePasswordPage.submit'})} />
          <span style={{color: 'red', marginLeft: 10, fontSize: 14}}>{errorMessage}</span>
        </form>
      </div>
    )
  }

}

export default injectIntl(connect((state, props) => {
  const {profile: {profile}} = state
  return {profile}
}, {push, changePassword})(ChangePasswordPage))
