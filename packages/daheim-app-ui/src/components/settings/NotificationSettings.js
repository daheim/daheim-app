import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage, injectIntl} from 'react-intl'
import RaisedButton from 'material-ui/RaisedButton'
import {subscribeToWebPush, unsubscribeFromWebPush} from '../../middlewares/service_worker'
import {testNotificationBroadcast} from '../../actions/notifications'

import {H2, VSpace, Button, Text} from '../Basic'
import {Padding} from '../../styles'

class NotAvailable extends Component {
  render () {
    return <Text><FormattedMessage id='notificationSettings.notAvailable'/></Text>
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

  handleSendTest = async () => {
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
        <Text><FormattedMessage id='notificationSettings.subscribed'/></Text>
        <VSpace v={Padding.m}/>
        <Button
          type='submit' neutral
          style={{width: 'auto'}}
          disabled={this.state.running}
          onClick={this.handleSendTest}
          >
          <FormattedMessage id='notificationSettings.sendTest'/>
        </Button>
        <Text>
          <a
            href='#'
            disabled={this.state.running}
            onClick={this.handleUnsubscribe}
            >
            <FormattedMessage id='notificationSettings.unsubscribe'/>
          </a>
        </Text>
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

  handleSubscribe = async () => {
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
    const {available, started, subscribed} = this.props

    //if (!started) return null

    return (
      <div>
        <H2><FormattedMessage id='notificationSettings.title'/></H2>
        <VSpace v={Padding.m}/>
        <Text><FormattedMessage id='notificationSettings.description'/></Text>
        <VSpace v={Padding.m}/>
        {available ? <Available subscribed={subscribed} /> : <NotAvailable />}
      </div>
    )
  }

}

export default connect((state) => {
  const {started, available, subscribed} = state.serviceWorker
  return {started, available, subscribed}
})(NotificationSettings)
