import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import {facebookLogin} from '../../actions/auth'
import {login, init} from '../../actions/facebook'

import {Color, Padding} from '../../styles'
import {Button, Flex, HSpace} from '../Basic'

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
    return (
      <Button style={{background: Color.facebook, width: '100%'}} onClick={this.login}>
        <Flex style={{height: '100%'}} justify='center' align='center'>
          <img
            style={{height: '22px', filter: 'brightness(100)', objectFit: 'contain'}}
            src='/icons/Icons_ready-04.svg'
          />
          <HSpace v={Padding.s}/>
          <FormattedMessage id='loginPage.signInWithFacebook'/>
        </Flex>
      </Button>
    )
  }

}

export default connect(null, {facebookLogin, login, init})(FacebookLogin)
