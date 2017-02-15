import React, {PropTypes} from 'react'
import moment from 'moment'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {FormattedMessage} from 'react-intl'
import styled from 'styled-components'

import LoadingPanel from '../LoadingPanel'
import {loadLessons} from '../../actions/lessons'
import {loadUser} from '../../actions/users'

import {H2, H3, Flex, Box, VSpace, Avatar, Text, Button} from '.././Basic'
import {Layout, Padding} from '../../styles'

const rowSpacing = Padding.l
const entryStyle = { width: Layout.widthPx / 4.5, marginRight: Padding.m, marginBottom: rowSpacing }

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -${rowSpacing};
  @media (max-width: ${Layout.mobileBreakpoint}) {
    justify-content: center;
  }
`

class ReviewList extends React.Component {

  static propTypes = {
    style: React.PropTypes.object,

    lessonList: PropTypes.shape({
      meta: PropTypes.object.isRequired,
      data: PropTypes.array.isRequired
    }).isRequired,
    lessons: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    usersMeta: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,

    push: React.PropTypes.func.isRequired,
    loadLessons: React.PropTypes.func.isRequired,
    loadUser: React.PropTypes.func.isRequired
  }

  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate

  componentWillMount () {
    this.props.loadLessons().suppressUnhandledRejections()
    this.checkUsers(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.lessonList !== nextProps.lessonList) this.checkUsers(nextProps)
  }

  checkUsers (props) {
    const usersToLoad = {}
    const {lessonList, lessons, users, usersMeta} = props

    for (let lessonId of lessonList.data) {
      const {data} = lessons[lessonId]
      if (!data) continue // load lesson, but this should not happen
      for (let participant of data.participants) {
        if (users[participant] || (usersMeta[participant] && usersMeta[participant].loading)) continue
        usersToLoad[participant] = 1
      }
    }

    for (let userId in usersToLoad) this.props.loadUser({id: userId}).suppressUnhandledRejections()
  }

  retry = (e) => {
    e.preventDefault()
    this.props.loadLessons().suppressUnhandledRejections()
  }

  msToString (ms) {
    if (typeof ms !== 'number') {
      return ''
    }
    let secs = Math.floor((ms / 1000) % 60)
    let mins = Math.floor(ms / 1000 / 60)
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  handleRowClick (e, lesson) {
    const {profile} = this.props
    const partnerId = lesson.participants.find((id) => id !== profile.id)

    this.props.push(`/users/${partnerId}`)
  }

  renderEntry(lesson) {
    const {users, usersMeta, profile} = this.props
    const handler = (e) => this.handleRowClick(e, lesson)
    const partnerId = lesson.participants.find((id) => id !== profile.id)
    const partner = users[partnerId] || {fake: true, name: 'wird geladen...'}
    const partnerMeta = usersMeta[partnerId]
    const partnerNotFound = partnerMeta && partnerMeta.error && partnerMeta.error.code === 'user_not_found'
    if (partner.fake && partnerNotFound) {
      partner.name = 'Benuzter Konto abgeschlossen'
    }
    const isFeedback = !partner.fake && partner.myReview

    return (
      <Flex
        key={lesson.id} column align='center'
        style={entryStyle}
        >
        <Avatar size='100px' src={partner.picture}/>
        <Text>{partner.name ? partner.name : '[kein Name]'}</Text>
        <Text>{moment(lesson.createdTime).format('lll')}</Text>
        <Text>{this.msToString(lesson.duration)}</Text>
        <VSpace v={Padding.m}/>
        <Button primary onClick={handler} style={{width: '100%'}}>
          <H3>Profil ansehen</H3>
        </Button>
        <VSpace v={Padding.s}/>
        <Button neutral={isFeedback} neg={!isFeedback} onClick={handler} style={{width: '100%'}}>
          <H3>{isFeedback ? 'Feedback bearbeiten' : 'Feedback abgeben'}</H3>
        </Button>
      </Flex>
    )
  }

  render () {
    const {lessonList, lessons} = this.props
    const error = !lessonList.meta.loaded && lessonList.meta.error

    return (
      <div style={{width: '100%'}}>
        <H2><FormattedMessage id='ready.previous'/></H2>
        <VSpace v={Padding.m}/>
        <LoadingPanel loading={lessonList.meta.loading && !lessonList.meta.loaded}>
          {error ? (
            <p style={{textAlign: 'center', color: 'darkred'}}>{error}. <a href='#' onClick={this.retry}>nochmal versuchen</a></p>
          ) : (
            lessonList.data.length ? (
              <Container>
                {lessonList.data.map(lessonId => this.renderEntry(lessons[lessonId].data))}
                {/* See http://stackoverflow.com/questions/18744164/flex-box-align-last-row-to-grid */}
                <Box style={entryStyle}/>
                <Box style={entryStyle}/>
                <Box style={entryStyle}/>
              </Container>
            ) : (
              <p style={{textAlign: 'center'}}>Du hast noch keine vorherige Lektionen.</p>
            )
          )}
        </LoadingPanel>
      </div>
    )
  }
}

export default connect((state) => {
  const {lessons: {lessonList, lessons}, users: {users, usersMeta}, profile: {profile}} = state
  return {lessonList, lessons, users, usersMeta, profile}
}, {loadLessons, loadUser, push})(ReviewList)
