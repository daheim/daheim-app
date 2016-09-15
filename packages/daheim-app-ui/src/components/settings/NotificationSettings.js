import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage, injectIntl} from 'react-intl'
import RaisedButton from 'material-ui/RaisedButton'
import {subscribeToWebPush, unsubscribeFromWebPush} from '../../middlewares/service_worker'
import {testNotificationBroadcast} from '../../actions/notifications'

class NotAvailable extends Component {
  render () {
    return <div><FormattedMessage id='notificationSettings.notAvailable' /></div>
  }
}

class Available extends Component {
  static propTypes = {
    subscribed: PropTypes.bool
  }

  render () {
    return this.props.subscribed ? <Subscribed /> : <NotSubscribed />
  }
}

class SubscribedRaw extends Component {
  static propTypes = {
    unsubscribeFromWebPush: PropTypes.func.isRequired,
    testNotificationBroadcast: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  }

  state = {
    running: false
  }

  handleUnsubscribe = async e => {
    e.preventDefault()

    if (this.state.running) return
    this.setState({running: true})
    try {
      await this.props.unsubscribeFromWebPush()
    } catch (err) {
      setTimeout(_ => window.alert(err.message))
    }
    this.setState({running: false})
  }

  handleSendTest = async e => {
    if (this.state.running) return
    this.setState({running: true})
    try {
      await this.props.testNotificationBroadcast()
    } catch (err) {
      setTimeout(_ => window.alert(err.message))
    }
    this.setState({running: false})
  }

  render () {
    return (
      <div>
        <div style={{color: '#5CB990', fontWeight: 700}}><FormattedMessage id='notificationSettings.subscribed' /></div>
        <div style={{marginTop: 20}}>
          <RaisedButton style={{marginRight: 16}} disabled={this.state.running} type='submit' primary label={this.props.intl.formatMessage({id: 'notificationSettings.sendTest'})} onClick={this.handleSendTest} />
          <a href='#' disabled={this.state.running} onClick={this.handleUnsubscribe}><FormattedMessage id='notificationSettings.unsubscribe' /></a>
        </div>
      </div>
    )
  }
}
const Subscribed = injectIntl(connect(null, {unsubscribeFromWebPush, testNotificationBroadcast})(SubscribedRaw))

class NotSubscribedRaw extends Component {
  static propTypes = {
    subscribeToWebPush: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  }

  state = {
    running: false
  }

  handleSubscribe = async e => {
    if (this.state.running) return
    this.setState({running: true})
    try {
      await this.props.subscribeToWebPush()
    } catch (err) {
      setTimeout(_ => window.alert(err.message))
    }
    this.setState({running: false})
  }

  render () {
    return (
      <div>
        <div style={{color: '#E61C78', fontWeight: 700}}><FormattedMessage id='notificationSettings.notSubscribed' /></div>
        <div style={{marginTop: 20}}>
          <RaisedButton disabled={this.state.running} type='submit' primary label={this.props.intl.formatMessage({id: 'notificationSettings.subscribe'})} onClick={this.handleSubscribe} />
        </div>
      </div>
    )
  }
}
const NotSubscribed = injectIntl(connect(null, {subscribeToWebPush})(NotSubscribedRaw))

class NotificationSettings extends Component {
  static propTypes = {
    subscribed: PropTypes.bool,
    available: PropTypes.bool,
    started: PropTypes.bool,
    style: PropTypes.object
  }

  render () {
    const {available, started, subscribed, style, ...rest} = this.props

    if (!started) return null

    return (
      <div style={{lineHeight: '150%', fontFamily: 'Lato, sans-serif', ...style}} {...rest}>
        <h2><FormattedMessage id='notificationSettings.title' /></h2>
        <div><FormattedMessage id='notificationSettings.description' /></div>
        <div style={{marginTop: 20}}>
          {available ? <Available subscribed={subscribed} /> : <NotAvailable />}
        </div>
      </div>
    )
  }

}

export default connect((state) => {
  const {started, available, subscribed} = state.serviceWorker
  return {started, available, subscribed}
})(NotificationSettings)
