/* eslint-env browser */

import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import RoleSwitch from '../RoleSwitch'
import {subscribeToWebPush, unsubscribeFromWebPush} from '../../middlewares/service_worker'
import {testNotification, testNotificationBroadcast, registerNotificationEndpoint} from '../../actions/notifications'
import version from '../../version'

const btoa = window.btoa
const alert = window.alert

class AdminPage extends Component {

  static propTypes = {
    subscribeToWebPush: PropTypes.func.isRequired,
    unsubscribeFromWebPush: PropTypes.func.isRequired,
    testNotification: PropTypes.func.isRequired,
    registered: PropTypes.bool.isRequired,
    testNotificationBroadcast: PropTypes.func.isRequired,
    registerNotificationEndpoint: PropTypes.func.isRequired
  }

  componentDidMount () {
    console.log('[version info]', version)
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

  testBroadcast = async () => {
    this.props.testNotificationBroadcast()
  }

  registerEndpoint = async () => {
    try {
      const sub = await this.props.subscribeToWebPush()

      const {endpoint} = sub
      const userPublicKey = sub.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))) : undefined
      const userAuth = sub.getKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))) : undefined

      await this.props.registerNotificationEndpoint({type: 'webpush', endpoint, userPublicKey, userAuth})
    } catch (err) {
      setTimeout(() => alert(err.message), 0)
    }
  }

  render () {
    return (
      <div style={{margin: 16}}>
        <h2>Version</h2>
        <div><b>Version:</b> {version.version}</div>
        <div><b>Environment:</b> {version.environment}</div>

        <h2>Change User Role</h2>
        <div><RoleSwitch /></div>

        <h2>Notifications</h2>
        <div>
          <div>Registered: {String(this.props.registered)}</div>
          <div>
            <button onClick={this.subscribe}>Subscribe</button>
            <button onClick={this.unsubscribe}>Unsubscribe</button>
            <button onClick={this.test}>Test</button>
            <button onClick={this.testBroadcast}>Test Broadcast</button>
            <button onClick={this.registerEndpoint}>Register Endpoint</button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state) => {
  const {registered} = state.serviceWorker
  return {registered}
}, {subscribeToWebPush, unsubscribeFromWebPush, testNotification, testNotificationBroadcast, registerNotificationEndpoint})(AdminPage)
