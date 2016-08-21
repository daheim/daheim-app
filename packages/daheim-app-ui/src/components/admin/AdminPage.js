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
      const userPublicKey = sub.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))) : undefined
      const userAuth = sub.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))) : undefined
      console.log('p256dh', userPublicKey)
      console.log('auth', userAuth)
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
      const userPublicKey = sub.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))) : undefined
      const userAuth = sub.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))) : undefined

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
