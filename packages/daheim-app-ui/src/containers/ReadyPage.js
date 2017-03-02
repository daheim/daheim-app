import React, {Component, PropTypes} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import Welcome from '../components/ready/Welcome'
import ReviewList from '../components/review/ReviewList'
import TalkAbout from '../components/TalkAbout'
import ReadyUsers from '../components/ReadyUsers'
import ReadySwitch from '../components/ready/ReadySwitch'
import TimeToChoose from '../components/ready/TimeToChoose'
import NotSupportedBrowser from '../components/ready/NotSupportedBrowser'

import {H1, Flex, VSpace} from '../components/Basic'
import {Padding} from '../styles'

class ReadyPageRaw extends React.Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    user: PropTypes.object,
    online: PropTypes.object
  }

  render () {
    const {user: {profile: {role} = {}} = {}} = this.props
    const isStudent = role === 'student'
    const isTeacher = role === 'teacher'
    const isNeither = !isStudent && !isTeacher

    return (
      <Flex column align='center'>
        <VSpace v={Padding.xl}/>
        <H1><FormattedMessage id='ready.title'/></H1>
        <VSpace v={Padding.xl}/>

        {isNeither && <TimeToChoose />}
        <NotSupportedBrowser />

        {role === 'student' ? (
          <ReadySwitch />
        ) : undefined}

        {role === 'teacher' ? (
          <ReadyUsers />
        ) : undefined}

        <Welcome/>

        <VSpace v={Padding.xl}/>
        <TalkAbout />

        <VSpace v={Padding.xl}/>
        <ReviewList />
      </Flex>
    )
  }
}

const ReadyPage = connect((state, props) => {
  const {live: {online}, profile: {profile: user}} = state
  return {online, user}
}, {push})(ReadyPageRaw)

class ReadyOrNotYetOpen extends Component {
  static propTypes = {
    accepted: PropTypes.bool
  }

  render () {
    // if (this.props.accepted) return <ReadyPage />
    // return <NotYetOpenPage />
    return <ReadyPage />
  }
}

export default connect((state) => {
  const {notYetOpen: {accepted}} = state
  return {accepted}
})(ReadyOrNotYetOpen)