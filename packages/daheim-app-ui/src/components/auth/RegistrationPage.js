import React, {Component, PropTypes} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {injectIntl} from 'react-intl'
import {FormattedMessage} from 'react-intl'

import LoadingPanel from '../LoadingPanel'
import {register} from '../../actions/auth'
import FacebookLogin from './FacebookLogin'
import {VSpace, Button, TextField, Checkbox} from '../Basic'
import {Padding, Fontsize, Color} from '../../styles'

class RegistrationFormRaw extends Component {

  static propTypes = {
    defaultUsername: PropTypes.string,
    onLogin: PropTypes.func,
    register: PropTypes.func.isRequired
  }

  state = {
    email: this.props.defaultUsername || '',
    password: '',
    newsletter: true,
    agree: false,
    loading: false,
    error: null,
    errorPassword: null,
    errorEmail: null,
    firstName: '',
  }

  handleNewsletterChange = (e) => this.setState({newsletter: e.target.checked})
  handleAgreeChange = (e) => this.setState({agree: e.target.checked})

  handleRegisterClick = async (e) => {
    e.preventDefault()

    if (!this.validateLogin()) return
    if (this.state.loading) return

    let success = true
    this.setState({loading: true})
    try {
      const result = await this.props.register({
        username: this.state.email,
        password: this.state.password,
        newsletter: this.state.newsletter,
        firstName: this.state.firstName
      })
      if (result.error) throw result.payload
      this.setState({error: null})
    } catch (err) {
      success = false
      this.setState({error: err.message})
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
    } else if (this.state.password.length < 6) {
      valid.hasErrors = true
      valid.errorPassword = valid.error = 'Passwort zu kurz (min. 6 Zeichen)'
    }

    if (!this.state.email) {
      valid.hasErrors = true
      valid.errorEmail = valid.error = 'Bitte E-Mail-Adresse eingeben'
    } else if (this.state.email.indexOf('@') === -1) {
      valid.hasErrors = true
      valid.errorEmail = valid.error = 'E-Mail-Adresse ist nicht gültig'
    }

    this.setState(valid)

    return !valid.hasErrors
  }

  handleEmailChange = (e) => this.setState({email: e.target.value})
  handlePasswordChange = (e) => this.setState({password: e.target.value})
  handleFirstNameChange = (e) => this.setState({firstName: e.target.value})

  render () {
    let error
    if (this.state.error === 'user_already_exists') {
      error = (
        <div style={{padding: '15px 30px 15px 15px', margin: '20px 0', backgroundColor: 'rgba(204,122,111,0.1)', borderLeft: '5px solid rgba(191,87,73,0.2)'}}>
          Mitglied gefunden. Klicken Sie hier, um <Link to={{pathname: '/auth', query: {username: this.state.email || undefined}}}>sich anzumelden</Link>.
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
        <form noValidate onSubmit={this.handleRegisterClick}>
          {error}
          <TextField
            placeholder={intl.formatMessage({id: 'registerPage.namePlaceholder'})}
            label={intl.formatMessage({id: 'registerPage.nameLabel'})}
            value={this.state.firstName}
            onChange={this.handleFirstNameChange}
          />
          <VSpace v={Padding.m}/>
          <TextField
            type='email'
            placeholder={intl.formatMessage({id: 'loginPage.emailPlaceholder'})}
            label={intl.formatMessage({id: 'loginPage.emailLabel'})}
            errorText={this.state.errorEmail}
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
          <VSpace v={Padding.s}/>
          <TextField
            type='password'
            placeholder={intl.formatMessage({id: 'loginPage.passwordPlaceholder'})}
            label={intl.formatMessage({id: 'loginPage.passwordLabel'})}
            errorText={this.state.errorPassword}
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <VSpace v={Padding.s}/>
          <Checkbox style={{width: '80%'}}
            label='Ich möchte mich für den Newsletter anmelden'
            checked={this.state.newsletter}
            onCheck={this.handleNewsletterChange}
          />
          <VSpace v={Padding.s}/>
          <Checkbox
            label='Ja, ich akzeptiere die AGB'
            checked={this.state.agree}
            onCheck={this.handleAgreeChange}
          />
          <VSpace v={Padding.m}/>
          <Button primary type='submit' disabled={!this.state.agree} style={{margin: '0 auto', textAlign: 'center'}}>Registrieren</Button>
          <VSpace v={Padding.m}/>
          <div style={{fontSize: Fontsize.m, textAlign: 'center', width: '80%', margin: '0 auto'}}>
            <FormattedMessage id='registerPage.bottomText' values={{
              br: <br/>,
              loginLink: <Link to={{pathname: '/auth', query: {username: this.state.email || undefined}}}><FormattedMessage id='registerPage.loginLinkText' /></Link>,
              agbLink: <a href='https://willkommen-daheim.org/agb/' target='_blank'><FormattedMessage id='registerPage.agbLinkText' /></a>
            }} />
          </div>
        </form>
      </LoadingPanel>
    )
  }
}

const RegistrationForm = connect(null, {register})(injectIntl(RegistrationFormRaw))

class RegistrationPage extends Component {

  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        username: PropTypes.string
      }).isRequired
    }).isRequired,
    push: PropTypes.func.isRequired
  };

  handleLogin = () => {
    this.props.push('/profile')
  };

  render () {
    return (
      <div style={{width: 340}}>
        <FacebookLogin onLogin={this.handleLogin}/>
        <VSpace v={Padding.s}/>
        <div style={{fontSize: Fontsize.m, textAlign: 'center', color: Color.black}}>oder</div>
        <VSpace v={Padding.s}/>
        <RegistrationForm onLogin={this.handleLogin} defaultUsername={this.props.location.query.username} />
      </div>
    )
  }
}

export default connect(null, {push})(RegistrationPage)
