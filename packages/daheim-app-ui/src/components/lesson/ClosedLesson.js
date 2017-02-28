import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {FormattedMessage, injectIntl} from 'react-intl'
import styled from 'styled-components'

import PublicProfilePage, {ProfileHeader} from '../profile/PublicProfilePage'
import {levelToString} from '../ProficiencyRating'

import {H2, H3, Text, Flex, VSpace, HSpace} from '../Basic'
import {Padding, Color} from '../../styles'

const Icon = styled.img`
  height: 20px;
  object-fit: contain;
`

class ClosedLesson extends Component {
  static propTypes = {
    closeReason: PropTypes.string.isRequired,
    partnerId: PropTypes.string
  }

  render () {
    const {closeReason, partnerId, user, intl} = this.props
    if (!partnerId || user == null) return (
      <H2><FormattedMessage id='lesson.thanks'/></H2>
    )
    return (
      <div>
        <Flex column align='center' justify='center'>
          <VSpace v={Padding.l}/>

          <ProfileHeader
            user={user}
            text={intl.formatMessage({id: 'lesson.germanLevel'}, {name: user.name, level: levelToString(user.germanLevel)})}
          />

          <VSpace v={Padding.m}/>

          <H2 style={{color: Color.red}}>
            <Flex align='center' justify='center'>
              <Icon src='/icons/Icons_ready-01.svg'/>
              <HSpace v={Padding.s}/>
              <FormattedMessage id='lesson.finished' values={{name: user.name}}/>
            </Flex>
          </H2>
          <VSpace v={Padding.m}/>
        </Flex>

        <H3><FormattedMessage id='lesson.provideFeedback1' values={{name: user.name}}/></H3>
        <Text><FormattedMessage id='lesson.provideFeedback2'/></Text>

        <PublicProfilePage
          params={{userId: partnerId}}
          hideHeader={true}
          reviewEditable={true}
          fromLesson={true}
        />

        <p style={{color: 'rgba(0, 0, 0, 0)'}}>Reason: {closeReason}</p>
      </div>
    )
  }
}

export default injectIntl(connect((state, props) => {
  const {lesson} = props
  if (!lesson) return {}
  const {teacherId, studentId} = lesson
  const myUserId = state.profile.profile.id
  const partnerId = teacherId === myUserId ? studentId : teacherId
  const user = state.users.users[partnerId]
  return {partnerId, user}
}, {push})(ClosedLesson))
