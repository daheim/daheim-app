import React, {Component, PropTypes} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import LoadingPanel from '../LoadingPanel'
import {register} from '../../actions/auth'
import FacebookLogin from './FacebookLogin'

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
    firstName: null
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

  componentDidMount () {
    this.refs.firstName.focus()
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

    return (
      <LoadingPanel loading={this.state.loading}>
        <form noValidate onSubmit={this.handleRegisterClick}>
          {error}
          <TextField ref='firstName' fullWidth floatingLabelText='Vorname' value={this.state.firstName} onChange={this.handleFirstNameChange} />
          <TextField ref='email' type='email' fullWidth floatingLabelText='E-Mail-Adresse' errorText={this.state.errorEmail} value={this.state.email} onChange={this.handleEmailChange} />
          <TextField ref='password' style={{marginTop: -10}} type='password' fullWidth errorText={this.state.errorPassword} floatingLabelText='Passwort' value={this.state.password} onChange={this.handlePasswordChange} />
          <Checkbox style={{marginTop: 20}} label='Ich möchte mich für den Newsletter anmelden' checked={this.state.newsletter} onCheck={this.handleNewsletterChange} />
          <Checkbox style={{marginTop: 10}} label='Ja, ich akzeptiere die AGB' checked={this.state.agree} onCheck={this.handleAgreeChange} />
          <div style={{textAlign: 'center'}}><RaisedButton disabled={!this.state.agree} type='submit' style={{marginTop: 20}} fullWidth primary label='Jetzt registrieren' /></div>
          <div style={{fontSize: 14, textAlign: 'center', paddingTop: 20}}>
            <FormattedMessage id='registerPage.buttomText' values={{
              loginLink: <Link to={{pathname: '/auth', query: {username: this.state.email || undefined}}}><FormattedMessage id='registerPage.loginLinkText' /></Link>,
              agbLink: <a href='https://willkommen-daheim.org/agb/' target='_blank'><FormattedMessage id='registerPage.agbLinkText' /></a>
            }} />
          </div>
        </form>
      </LoadingPanel>
    )
  }
}

const RegistrationForm = connect(null, {register})(RegistrationFormRaw)

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
      <div style={{width: 400}}>
        <h1 style={{fontSize: 22, marginTop: 40}}>Jetzt kostenlos Mitglied werden!</h1>
        <div style={{paddingBottom: 16, marginBottom: 4, borderBottom: 'dashed 1px gray'}}><FacebookLogin onLogin={this.handleLogin} /></div>
        <RegistrationForm onLogin={this.handleLogin} defaultUsername={this.props.location.query.username} />
      </div>
    )
  }
}

export default connect(null, {push})(RegistrationPage)
