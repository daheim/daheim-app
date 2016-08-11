import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {logout} from '../../actions/auth'

class LogoutPage extends Component {

  static propTypes = {
    logout: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }

  async componentWillMount () {
    try {
      await this.props.logout()
    } catch (ex) {
      // ignore
    }
    this.props.push('/auth')
  }

  render () {
    return <div>Ausloggen...</div>
  }

}

export default connect(null, {logout, push})(LogoutPage)
