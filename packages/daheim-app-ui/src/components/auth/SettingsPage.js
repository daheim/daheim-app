import React, {PropTypes, Component} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import Helmet from 'react-helmet'
import {FormattedMessage, injectIntl} from 'react-intl'

import {changePassword} from '../../actions/auth'
import CloseAccount from './CloseAccount'
import NotificationSettings from '../settings/NotificationSettings'

import {H1, H2, Flex, VSpace, Button, Text, TextField} from '../Basic'
import {Layout, Padding, Color} from '../../styles'

class SettingsPage extends Component {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
  }

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
      errors.passwordError = intl.formatMessage({id: 'settings.requiredField'})
    }
    if (!newPassword) {
      error = true
      errors.newPasswordError = intl.formatMessage({id: 'settings.requiredField'})
    }
    if (newPassword !== repeatNewPassword) {
      error = true
      errors.repeatNewPasswordError = intl.formatMessage({id: 'settings.newPasswordMismatch'})
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
      <div>
        <Helmet title={intl.formatMessage({id: 'settings.title'})}/>
        <VSpace v={Padding.xl}/>
        <Flex justify='center'><H1><FormattedMessage id='settings.title'/></H1></Flex>
        <VSpace v={Padding.xl}/>

        <NotificationSettings style={{padding: '16px 16px'}}/>

        <VSpace v={Padding.xl}/>

        <H2><FormattedMessage id='settings.newsletter'/></H2>
        <VSpace v={Padding.m}/>
        <Text><FormattedMessage id='settings.newsletter.text'/></Text>
        <Text>TODO: Switch (Abonniert/Abmelden)</Text>

        <VSpace v={Padding.xl}/>

        <form noValidate onSubmit={this.handleSubmit} style={{maxWidth: Layout.innerWidthPx / 2}}>
          <H2><FormattedMessage id='settings.changeEmail'/></H2>
          <VSpace v={Padding.m}/>
          <TextField
            readOnly neutral type='email'
            label={intl.formatMessage({id: 'forgotPasswordPage.emailAddressLabel'})}
            value={profile.username}
          />
          <VSpace v={Padding.m}/>
          <H2><FormattedMessage id='settings.changePassword' /></H2>
          <VSpace v={Padding.m}/>
          <TextField
            type='password' neutral
            error={passwordError}
            placeholder={intl.formatMessage({id: 'settings.currentPassword'})}
            value={password}
            onChange={this.handlePasswordChange}
          />
          <TextField
            type='password' neutral
            error={newPasswordError}
            placeholder={intl.formatMessage({id: 'settings.newPassword'})}
            value={newPassword}
            onChange={this.handleNewPasswordChange}
          />
          <TextField
            type='password' neutral
            error={repeatNewPasswordError}
            placeholder={intl.formatMessage({id: 'settings.repeatNewPassword'})}
            value={repeatNewPassword}
            onChange={this.handleRepeatNewPasswordChange}
          />
          <VSpace v={Padding.m}/>
          <Button type='submit' neutral disabled={running} style={{width: 'auto', paddingLeft: 30, paddingRight: 30}}>
            <FormattedMessage id='settings.submit'/>
          </Button>
          <VSpace v={Padding.s}/>
          <Text style={{color: Color.red}}>{errorMessage}</Text>
        </form>

        <VSpace v={Padding.xl}/>
        <CloseAccount/>
      </div>
    )
  }

}

export default injectIntl(connect((state, props) => {
  const {profile: {profile}} = state
  return {profile}
}, {push, changePassword})(SettingsPage))
