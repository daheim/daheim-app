import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage, injectIntl} from 'react-intl'
import {subscribeToWebPush, unsubscribeFromWebPush} from '../../middlewares/service_worker'
import {testNotificationBroadcast} from '../../actions/notifications'

import {H2, H3, VSpace, Button, Text, Switch} from '../Basic'
import {Layout, Padding} from '../../styles'

class NotificationSwitch extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    activated: PropTypes.bool,
    onSwitch: PropTypes.func,
  }

  render() {
    const {small, activated, onSwitch, disabled} = this.props
    return (
      <div style={{width: 260}}>
        {!small && <H3>Benachrichtigungen</H3>}
        <Switch
          disabled={disabled}
          selected={1 - activated}
          label0="Aktiviert"
          label1="Deaktiviert"
          onSwitch={() => onSwitch(!activated)}
        />
      </div>
    )
  }
}

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
    const {small} = this.props
    return this.props.subscribed ? <Subscribed small={small} /> : <NotSubscribed small={small} />
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

  handleUnsubscribe = async () => {
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
        <NotificationSwitch
          disabled={this.state.running}
          activated={true}
          onSwitch={this.handleUnsubscribe}
          small={this.props.small}
        />
        {!this.props.small &&
          <div>
            <VSpace v={Padding.m}/>
            <Button
              type='submit' neutral
              style={{width: 'auto'}}
              disabled={this.state.running}
              onClick={this.handleSendTest}
              >
              <FormattedMessage id='notificationSettings.sendTest'/>
            </Button>
          </div>
        }
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
      <NotificationSwitch
        disabled={this.state.running}
        activated={false}
        onSwitch={this.handleSubscribe}
        small={this.props.small}
      />
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
        <Text style={{maxWidth: Layout.innerWidthPx / 1.25}}>
          <FormattedMessage id='notificationSettings.description'/>
        </Text>
        <VSpace v={Padding.m}/>
        {available ? <Available subscribed={subscribed} /> : <NotAvailable />}
      </div>
    )
  }

}

class NotificationSettingsSmallRaw extends Component {
  static propTypes = {
    subscribed: PropTypes.bool,
    available: PropTypes.bool,
    started: PropTypes.bool,
    style: PropTypes.object
  }

  render () {
    const {available, started, subscribed} = this.props

    return (
      <div>
        {available ? <Available subscribed={subscribed} small={true} /> : <NotAvailable />}
      </div>
    )
  }
}

export const NotificationSettingsSmall = connect((state) => {
  const {started, available, subscribed} = state.serviceWorker
  return {started, available, subscribed}
})(NotificationSettingsSmallRaw)

export default connect((state) => {
  const {started, available, subscribed} = state.serviceWorker
  return {started, available, subscribed}
})(NotificationSettings)
