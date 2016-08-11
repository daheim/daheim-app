import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {FormattedMessage, injectIntl} from 'react-intl'

import {forgot} from '../../actions/auth'
import LoadingPanel from '../LoadingPanel'

class ForgotPasswordFormRaw extends React.Component {

  static propTypes = {
    defaultUsername: React.PropTypes.string,
    onLogin: React.PropTypes.func,
    forgot: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
  }

  state = {
    email: this.props.defaultUsername || '',
    loading: false,
    error: null,
    errorEmail: null
  }

  handleLoginClick = async (e) => {
    e.preventDefault()

    if (!this.validateLogin()) return
    if (this.state.loading) return

    let success = true
    this.setState({loading: true})
    try {
      await this.props.forgot({
        username: this.state.email
      })
      this.setState({error: null})
    } catch (err) {
      success = false
      if (err.code === 'user_not_found') {
        this.setState({error: 'user_not_found'})
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
      errorEmail: null
    }

    if (!this.state.email) {
      valid.hasErrors = true
      valid.errorEmail = valid.error = this.props.intl.formatMessage({id: 'emailAddressMissing'})
    }

    this.setState(valid)

    return !valid.hasErrors
  }

  componentDidMount () {
    this.refs.email.focus()
  }

  handleEmailChange = (e) => this.setState({email: e.target.value})

  render () {
    const {intl} = this.props

    let error
    if (this.state.error === 'user_not_found') {
      error = (
        <div style={{padding: '15px 30px 15px 15px', margin: '20px 0', backgroundColor: 'rgba(204,122,111,0.1)', borderLeft: '5px solid rgba(191,87,73,0.2)'}}>
          <Link to={{pathname: '/auth/register', query: {username: this.state.email || undefined}}}><FormattedMessage id='forgotPasswordPage.userNotFound' /></Link>
        </div>
      )
    } else if (this.state.error) {
      error = (
        <div style={{padding: '15px 30px 15px 15px', margin: '20px 0', backgroundColor: 'rgba(204,122,111,0.1)', borderLeft: '5px solid rgba(191,87,73,0.2)'}}>
          <FormattedMessage id='errorMessage' values={{message: this.state.error}} />
        </div>
      )
    }

    return (
      <LoadingPanel loading={this.state.loading}>
        <form onSubmit={this.handleLoginClick}>
          <h1 style={{fontSize: 22}}><FormattedMessage id='forgotPasswordPage.title' /></h1>
          <h2 style={{fontSize: 14, fontWeight: 400, lineHeight: '150%'}}><FormattedMessage id='forgotPasswordPage.description' /></h2>
          {error}
          <TextField ref='email' fullWidth floatingLabelText={intl.formatMessage({id: 'forgotPasswordPage.emailAddressLabel'})} errorText={this.state.errorEmail} value={this.state.email} onChange={this.handleEmailChange} />
          <div style={{textAlign: 'center'}}><RaisedButton type='submit' style={{marginTop: 20}} fullWidth primary label={intl.formatMessage({id: 'forgotPasswordPage.submitLabel'})} /></div>
        </form>
      </LoadingPanel>
    )
  }
}

const ForgotPasswordForm = injectIntl(connect(null, {forgot})(ForgotPasswordFormRaw))

export class EmailSent extends React.Component {

  static propTypes = {
    style: React.PropTypes.object
  }

  render () {
    return (
      <div style={this.props.style}><FormattedMessage id='forgotPasswordPage.emailSent' /></div>
    )
  }

}

export default class ForgotPasswordPage extends React.Component {

  static propTypes = {
    location: React.PropTypes.shape({
      query: React.PropTypes.shape({
        username: React.PropTypes.string
      }).isRequired
    }).isRequired
  }

  state = {
    sent: false
  }

  handleLogin = () => {
    this.setState({sent: true})
  }

  render () {
    return (
      <div style={{maxWidth: 400, margin: '0 auto', padding: '16px 10px'}}>
          {!this.state.sent ? (
            <ForgotPasswordForm onLogin={this.handleLogin} defaultUsername={this.props.location.query.username} />
          ) : (
            <EmailSent style={{paddingTop: 8}} />
          )}
      </div>
    )
  }

}

