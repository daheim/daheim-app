import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {injectIntl} from 'react-intl'
import styled from 'styled-components'

import LoadingPanel from '../LoadingPanel'
import {login} from '../../actions/auth'
import FacebookLogin from './FacebookLogin'
import {VSpace, Button, TextField as TextField2} from '../Basic'
import {Padding, Fontsize, Color} from '../../styles'

const InputHelp = styled.div`
  font-size: ${Fontsize.m};
  color: ${Color.black};
`

const Input = styled.input`
  height: 33px;
  width: 100%;
  padding-left: 5px;
  color: ${Color.green};
  border-radius: 6px;
  border: 2.666px solid ${Color.green};
`

class LoginFormRaw extends Component {

  static propTypes = {
    defaultUsername: PropTypes.string,
    onLogin: PropTypes.func,
    login: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  }

  state = {
    email: this.props.defaultUsername || '',
    password: '',
    loading: false,
    error: null,
    errorPassword: null,
    errorEmail: null
  }

  handleLoginClick = async (e) => {
    e.preventDefault()

    if (!this.validateLogin()) return
    if (this.state.loading) return

    let success = true
    this.setState({loading: true})
    try {
      await this.props.login({
        username: this.state.email,
        password: this.state.password
      })
      this.setState({error: null})
    } catch (err) {
      success = false
      const info = err.info || {}
      if (err.code === 'unauthorized') {
        if (info.userNotFound) this.setState({error: this.props.intl.formatMessage({id: 'loginPage.userNotFound'})})
        else this.setState({error: this.props.intl.formatMessage({id: 'loginPage.invalidPassword'})})
      } else {
        this.setState({error: err.message})
      }
    } finally {
      this.setState({loading: false})
    }

    if (success && this.props.onLogin) this.props.onLogin()
  }

  validateLogin () {
    let valid = {
      hasErrors: false,
      errorPassword: null,
      errorEmail: null
    }

    if (!this.state.password) {
      valid.hasErrors = true
      valid.errorPassword = valid.error = 'Bitte Passwort eingeben'
    }

    if (!this.state.email) {
      valid.hasErrors = true
      valid.errorEmail = valid.error = 'Bitte E-Mail-Adresse eingeben'
    }

    this.setState(valid)

    return !valid.hasErrors
  }

  handleEmailChange = (e) => this.setState({email: e.target.value})
  handlePasswordChange = (e) => this.setState({password: e.target.value})

  render () {
    let error
    if (this.state.error === 'user_already_exists') {
      error = (
        <div style={{padding: '15px 30px 15px 15px', margin: '20px 0', backgroundColor: 'rgba(204,122,111,0.1)', borderLeft: '5px solid rgba(191,87,73,0.2)'}}>
          Mitglied gefunden. Klicken Sie hier, um <a href='#'>sich anzumelden</a>.
        </div>
      )
    } else if (this.state.error) {
      error = (
        <div style={{padding: '15px 30px 15px 15px', margin: '20px 0', backgroundColor: 'rgba(204,122,111,0.1)', borderLeft: '5px solid rgba(191,87,73,0.2)'}}>
          Fehler: {this.state.error}
        </div>
      )
    }

    const intl = this.props.intl

    return (
      <LoadingPanel loading={this.state.loading}>
        <form noValidate onSubmit={this.handleLoginClick} className='loginForm'>
          {error}
          <TextField2
            innerRef={r => this.emailRef = r}
            type='email'
            placeholder={intl.formatMessage({id: 'loginPage.emailPlaceholder'})}
            label={intl.formatMessage({id: 'loginPage.emailLabel'})}
            error={this.state.errorEmail}
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
          <VSpace v={Padding.s}/>
          <TextField2
            innerRef={r => this.passwordRef = r}
            type='password'
            placeholder={intl.formatMessage({id: 'loginPage.passwordPlaceholder'})}
            label={intl.formatMessage({id: 'loginPage.passwordLabel'})}
            error={this.state.errorPassword}
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <VSpace v={Padding.m}/>
          <Button primary type='submit' style={{margin: '0 auto', textAlign: 'center'}}>Einloggen</Button>
          <VSpace v={Padding.m}/>
          <div style={{fontSize: Fontsize.m, textAlign: 'center', width: '80%', margin: '0 auto'}}>
            Hast Du Dein&nbsp;
            <Link to={{pathname: '/auth/forgot', query: {username: this.state.email || undefined}}}>Passwort vergessen</Link>
            &nbsp;oder möchtest Du Dich&nbsp;
            <Link to={{pathname: '/auth/register', query: {username: this.state.email || undefined}}}>neu registrieren</Link>
            ?
          </div>
        </form>
      </LoadingPanel>
    )
  }
}

const LoginForm = injectIntl(LoginFormRaw)

class LoginPage extends Component {

  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        username: PropTypes.string
      }).isRequired
    }).isRequired,
    push: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired
  }

  handleLogin = () => {
    this.props.push('/')
  }

  render () {
    return (
      <div style={{width: 340}}>
        <div>
          <FacebookLogin onLogin={this.handleLogin} />
          <VSpace v={Padding.l}/>
          <LoginForm
            onLogin={this.handleLogin}
            login={this.props.login}
            defaultUsername={this.props.location.query.username}
          />
        </div>
      </div>
    )
  }

}

export default connect(null, {push, login})(LoginPage)
