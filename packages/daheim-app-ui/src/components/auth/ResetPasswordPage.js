import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {Link} from 'react-router'
import {replace} from 'react-router-redux'
import {connect} from 'react-redux'

import {reset} from '../../actions/auth'
import LoadingPanel from '../LoadingPanel'

class ResetPasswordFormRaw extends React.Component {

  static propTypes = {
    token: React.PropTypes.string.isRequired,
    onLogin: React.PropTypes.func,
    reset: React.PropTypes.func.isRequired
  }

  state = {
    password: '',
    password2: '',
    loading: false,
    error: null,
    errorPassword: null,
    errorPassword2: null
  }

  handleLoginClick = async (e) => {
    e.preventDefault()

    if (!this.validateLogin()) return
    if (this.state.loading) return

    let success = true
    this.setState({loading: true})
    try {
      await this.props.reset({
        password: this.state.password,
        token: this.props.token
      })
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
      errorPassword2: null
    }

    if (this.state.password !== this.state.password2) {
      valid.hasErrors = true
      valid.errorPassword2 = valid.error = 'Die eingegebenen Passwörter stimmen nicht überein'
      this.refs.password2.focus()
    }

    if (!this.state.password) {
      valid.hasErrors = true
      valid.errorPassword = valid.error = 'Bitte Passwort eingeben'
      this.refs.password.focus()
    } else if (this.state.password.length < 6) {
      valid.hasErrors = true
      valid.errorPassword = valid.error = 'Passwort zu kurz (min. 6 Zeichen)'
      this.refs.password.focus()
    }

    this.setState(valid)

    return !valid.hasErrors
  }

  componentDidMount () {
    this.refs.password.focus()
  }

  handlePasswordChange = (e) => this.setState({password: e.target.value})
  handlePassword2Change = (e) => this.setState({password2: e.target.value})

  render () {
    let error
    if (this.state.error === 'user_not_found') {
      error = (
        <div style={{padding: '15px 30px 15px 15px', margin: '20px 0', backgroundColor: 'rgba(204,122,111,0.1)', borderLeft: '5px solid rgba(191,87,73,0.2)'}}>
          Kein Mitglied gefunden. Klick hier, um <Link to={{pathname: '/auth/register', query: {username: this.state.email || undefined}}}>neu anzumelden</Link>.
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
        <form onSubmit={this.handleLoginClick}>
          <h1 style={{fontSize: 22}}>Passwort zurücksetzen</h1>
          {error}
          <TextField ref='password' style={{marginTop: -10}} type='password' fullWidth errorText={this.state.errorPassword} floatingLabelText='Passwort' value={this.state.password} onChange={this.handlePasswordChange} />
          <TextField ref='password2' style={{marginTop: -10}} type='password' fullWidth errorText={this.state.errorPassword2} floatingLabelText='Passwort bestätigen' value={this.state.password2} onChange={this.handlePassword2Change} />
          <div style={{textAlign: 'center'}}><RaisedButton type='submit' style={{marginTop: 20}} fullWidth primary label='Passwort ändern' /></div>
        </form>
      </LoadingPanel>
    )
  }
}

const ResetPasswordForm = connect(null, {reset})(ResetPasswordFormRaw)

class ResetPasswordPage extends React.Component {

  static propTypes = {
    location: React.PropTypes.shape({
      query: React.PropTypes.shape({
        token: React.PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    replace: React.PropTypes.func.isRequired
  }

  state = {
    sent: false
  }

  handleLogin = () => {
    this.props.replace('/')
  }

  render () {
    return (
      <div style={{maxWidth: 400, margin: '0 auto', padding: '16px 10px'}}>
        <ResetPasswordForm onLogin={this.handleLogin} token={this.props.location.query.token} />
      </div>
    )
  }

}

export default connect(null, {replace})(ResetPasswordPage)

