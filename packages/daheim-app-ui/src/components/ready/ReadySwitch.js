import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {FormattedMessage, FormattedHTMLMessage, injectIntl} from 'react-intl'

import {ready as setReady} from '../../actions/live'
import style from './ReadySwitch.style'

import {Button, H1, Flex, HSpace, CircularProgress, Text} from '../Basic'
import {Layout, Padding} from '../../styles'

class Connecting extends Component {
  static propTypes = {
    error: PropTypes.string
  }

  render () {
    const {error} = this.props

    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{margin: 20}}><CircularProgress size={0.3}/></div>
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

const ButtonIcon = styled.img`
  height: 40px;
  object-fit: contain;
  filter: brightness(100);
`

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
      window.alert(err.message)
    }
  }

  goOnline = async () => {
    if (this.state.busy) return
    this.setState({busy: true})

    try {
      await this.props.setReady({ready: true})
    } catch (err) {
      window.alert(this.props.intl.formatMessage({id: 'errorMessage'}, {message: err.message}))
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
      window.alert(this.props.intl.formatMessage({id: 'errorMessage'}, {message: err.message}))
    } finally {
      this.setState({busy: false})
    }
  }

  shareOnFb = (e) => {
    e.preventDefault()
    FB.ui({
      method: 'share',
      href: 'https://willkommen-daheim.org/',
    }, function(response){});
  }

  render () {
    const {ready, connected} = this.props
    const {busy} = this.state
    const {user: {profile: {role} = {}} = {}} = this.props
    const isStudent = role === 'student'

    if (!connected) return <Connecting {...this.props} />

    if (!ready && !busy) {
      return (
        <Button primary onClick={this.goOnline} style={{width: '100%', maxWidth: Layout.widthPx * 0.65}}>
          <Flex align='center' justify='center'>
            <ButtonIcon src='/icons/Icons_ready-02.svg'/>
            <HSpace v={Padding.s}/>
            <H1><FormattedMessage id='ready.buttonCaption'/></H1>
          </Flex>
        </Button>
      )
    } else {
      return (
        <Flex align='center' justify='center'>
          <CircularProgress size={0.3}/>
          <HSpace v={`${Padding.sPx * 2}px`}/>
          <Text style={{maxWidth: Layout.widthPx * 0.4}}>
            <FormattedHTMLMessage
              id={`ready.lookingForPartners${isStudent ? 'AsStudent' : ''}`}
              values={{link: 'https://www.google.com'}}
            />
            &nbsp;
            <a href='#' onClick={this.goOffline}><FormattedMessage id='ready.cancel'/></a>
            {/*<br/>*/}
            {/*<a href='#' onClick={this.shareOnFb}>Share on Facebook</a>*/}
          </Text>
        </Flex>
      )
    }
  }
}

export default injectIntl(connect((state, props) => {
  const {live: {connected, ready, error, readyTopic}} = state
  const user = state.profile.profile
  return {user, connected, ready, error, readyTopic}
}, {setReady})(ReadySwitch))
