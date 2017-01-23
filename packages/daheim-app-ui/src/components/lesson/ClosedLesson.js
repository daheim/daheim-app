import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {FormattedMessage} from 'react-intl'

import PublicProfilePage from '../profile/PublicProfilePage'

class ClosedLesson extends Component {
  static propTypes = {
    closeReason: PropTypes.string.isRequired,
    partnerId: PropTypes.string
  }

  render () {
    const {closeReason, partnerId} = this.props
    return (
      <div style={{margin: 16}}>
        <h1><FormattedMessage id='closedLesson.conversationEnded' /></h1>
        {partnerId ? <PublicProfilePage params={{userId: partnerId}} /> : null}
        <p style={{color: 'rgba(0, 0, 0, 0)'}}><FormattedMessage id='closedLesson.reason' />: {closeReason}</p>
      </div>
    )
  }
}

export default connect((state, props) => {
  const {lesson} = props
  if (!lesson) return {}
  const {teacherId, studentId} = lesson
  const myUserId = state.profile.profile.id
  const partnerId = teacherId === myUserId ? studentId : teacherId
  return {partnerId}
}, {push})(ClosedLesson)
