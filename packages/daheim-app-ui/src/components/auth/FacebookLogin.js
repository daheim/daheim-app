import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import {facebookLogin} from '../../actions/auth'
import {login, init} from '../../actions/facebook'
import css from './FacebookLogin.style'

const alert = window.alert

class FacebookLogin extends Component {

  static propTypes = {
    init: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    facebookLogin: PropTypes.func.isRequired,
    onLogin: PropTypes.func
  }

  state = {
    inited: false
  }

  async componentDidMount () {
    await this.props.init()
    this.setState({inited: true})
  }

  login = async () => {
    try {
      const response = await this.props.login({scope: 'email', auth_type: 'rerequest'})
      const {accessToken} = response.authResponse
      await this.props.facebookLogin({facebookAccessToken: accessToken})
      if (this.props.onLogin) this.props.onLogin()
    } catch (err) {
      alert(err.message) // TODO: localize error message
    }
  }

  render () {
    if (!this.state.inited) return null
    return <a className={css.fbLoginButton} onClick={this.login}><FormattedMessage id='loginPage.signInWithFacebook' /></a>
  }

}

export default connect(null, {facebookLogin, login, init})(FacebookLogin)
