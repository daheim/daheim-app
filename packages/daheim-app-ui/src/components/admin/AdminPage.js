import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import RoleSwitch from '../RoleSwitch'
import {subscribeToWebPush, unsubscribeFromWebPush} from '../../middlewares/service_worker'
import {testNotification} from '../../actions/notifications'

class AdminPage extends Component {

  static propTypes = {
    subscribeToWebPush: PropTypes.func.isRequired,
    unsubscribeFromWebPush: PropTypes.func.isRequired,
    testNotification: PropTypes.func.isRequired,
    registered: PropTypes.bool.isRequired
  }

  subscribe = async () => {
    try {
      const sub = await this.props.subscribeToWebPush()
      console.log('sub', sub)
      console.log('p256dh', btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))))
      console.log('auth', btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))))
    } catch (err) {
      setTimeout(() => alert(err.message), 0)
    }
  }

  unsubscribe = () => {
    try {
      this.props.unsubscribeFromWebPush()
    } catch (err) {
      setTimeout(() => alert(err.message), 0)
    }
  }

  test = async () => {
    try {
      const sub = await this.props.subscribeToWebPush()

      const {endpoint} = sub
      const userPublicKeyArr = sub.getKey ? sub.getKey('p256dh') : ''
      const userPublicKey = btoa(String.fromCharCode.apply(null, new Uint8Array(userPublicKeyArr)))
      const userAuthArr = sub.getKey ? sub.getKey('auth') : ''
      const userAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(userAuthArr)))

      await this.props.testNotification({endpoint, userPublicKey, userAuth})
    } catch (err) {
      setTimeout(() => alert(err.message), 0)
    }
  }

  render () {
    return (
      <div style={{margin: 16}}>
        <h2>Change User Role</h2>
        <div><RoleSwitch /></div>

        <h2>Notifications</h2>
        <div>
          <div>Registered: {String(this.props.registered)}</div>
          <div>
            <button onClick={this.subscribe}>Subscribe</button>
            <button onClick={this.unsubscribe}>Unsubscribe</button>
            <button onClick={this.test}>Test</button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state) => {
  const {registered} = state.serviceWorker
  return {registered}
}, {subscribeToWebPush, unsubscribeFromWebPush, testNotification})(AdminPage)
