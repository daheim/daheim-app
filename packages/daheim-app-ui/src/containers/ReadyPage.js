import React, {Component, PropTypes} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import NotYetOpenPage from '../components/ready/NotYetOpenPage'
import ReviewList from '../components/review/ReviewList'
import TalkAbout from '../components/TalkAbout'
import ReadyUsers from '../components/ReadyUsers'
import ReadySwitch from '../components/ready/ReadySwitch'
import TimeToChoose from '../components/ready/TimeToChoose'
import NotYetInOperation from '../components/NotYetInOperation'
import NotSupportedBrowser from '../components/ready/NotSupportedBrowser'

class ReadyPageRaw extends React.Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    user: PropTypes.object,
    online: PropTypes.object
  }

  render () {
    const {user: {profile: {role} = {}} = {}} = this.props

    return (
      <div style={{padding: 16}}>

        <TimeToChoose />
        <NotSupportedBrowser />
        <NotYetInOperation />

        {role === 'student' ? (
          <ReadySwitch />
        ) : undefined}

        {role === 'teacher' ? (
          <ReadyUsers />
        ) : undefined}

        <ReviewList />
        <TalkAbout />
      </div>
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
