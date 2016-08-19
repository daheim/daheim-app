import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import {FormattedMessage, injectIntl} from 'react-intl'

import {ready as setReady} from '../../actions/live'
import style from './ReadySwitch.style'

class Connecting extends Component {
  static propTypes = {
    error: PropTypes.string
  }

  render () {
    const {error} = this.props

    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{margin: 20}}><CircularProgress /></div>
        <div style={{margin: 8}}>
          <div className={style.connecting}><FormattedMessage id='ready.connecting' /></div>
          {error ? (
            <div className={style.error}><FormattedMessage id='errorMessage' values={{message: error}} /></div>
          ) : null}
        </div>
      </div>
    )
  }
}

class ReadySwitch extends Component {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    ready: PropTypes.bool,
    connected: PropTypes.bool,
    setReady: PropTypes.func.isRequired,
    readyTopic: PropTypes.string
  }

  state = {busy: false}

  handleReadyChange = async (e) => {
    try {
      await this.props.setReady({ready: e.target.checked})
    } catch (err) {
      alert(err.message)
    }
  }

  goOnline = async () => {
    if (this.state.busy) return
    this.setState({busy: true})

    try {
      await this.props.setReady({ready: true})
    } catch (err) {
      alert(this.props.intl.formatMessage({id: 'errorMessage'}, {message: err.message}))
    } finally {
      this.setState({busy: false})
    }
  }

  goOffline = async (e) => {
    e.preventDefault()

    if (this.state.busy) return
    this.setState({busy: true})

    try {
      await this.props.setReady({ready: false})
    } catch (err) {
      alert(this.props.intl.formatMessage({id: 'errorMessage'}, {message: err.message}))
    } finally {
      this.setState({busy: false})
    }
  }

  render () {
    const {ready, connected, intl} = this.props
    const {busy} = this.state

    if (!connected) return <Connecting {...this.props} />

    if (!ready && !busy) {
      return (
        <div style={{textAlign: 'center', margin: '40px 20px'}}>
          <RaisedButton className='readySwitch' label={intl.formatMessage({id: 'ready.buttonCaption'})} primary onClick={this.goOnline} />
        </div>
      )
    } else {
      return (
        <div style={{display: 'flex', alignItems: 'center', margin: 20}}>
          <div style={{margin: 20}}><CircularProgress /></div>
          <div style={{margin: 8}}>
            <div><FormattedMessage id='ready.lookingForPartners' /> <a href='#' onClick={this.goOffline}><FormattedMessage id='ready.cancel' /></a></div>
          </div>
        </div>
      )
    }
  }
}

export default injectIntl(connect((state, props) => {
  const {live: {connected, ready, error, readyTopic}} = state
  return {connected, ready, error, readyTopic}
}, {setReady})(ReadySwitch))
