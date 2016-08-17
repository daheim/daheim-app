import React, {PropTypes} from 'react'
import moment from 'moment'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import LoadingPanel from '../LoadingPanel'
import {loadLessons} from '../../actions/lessons'
import {loadUser} from '../../actions/users'

import css from './ReviewList.style'

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

  render () {
    const {lessonList, lessons, users, usersMeta, profile, style} = this.props
    const error = !lessonList.meta.loaded && lessonList.meta.error
    const mergedStyle = {maxWidth: 600, ...style}

    return (
      <div {...this.props} style={mergedStyle}>
        <h2>Vorherige Gespräche</h2>
        <LoadingPanel loading={lessonList.meta.loading && !lessonList.meta.loaded}>
          {error ? (
            <p style={{textAlign: 'center', color: 'darkred'}}>{error}. <a href='#' onClick={this.retry}>nochmal versuchen</a></p>
          ) : (
            lessonList.data.length ? (
              <table style={{width: '100%', borderCollapse: 'collapse'}} spacing='0'>
                <thead>
                  <tr>
                    <th style={{textAlign: 'left'}}>Datum</th>
                    <th>&nbsp;</th>
                    <th style={{textAlign: 'left'}}>Partner</th>
                    <th style={{textAlign: 'left'}}>Länge</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lessonList.data.map((lessonId) => {
                    const lesson = lessons[lessonId].data
                    const handler = (e) => this.handleRowClick(e, lesson)
                    const partnerId = lesson.participants.find((id) => id !== profile.id)
                    const partner = users[partnerId] || {fake: true, name: 'wird geladen...'}
                    const partnerMeta = usersMeta[partnerId]
                    const partnerNotFound = partnerMeta && partnerMeta.error && partnerMeta.error.code === 'user_not_found'
                    if (partner.fake && partnerNotFound) {
                      partner.name = 'Benuzter Konto abgeschlossen'
                    }

                    return (
                      <tr key={lesson.id} className={css.line} onClick={handler}>
                        <td style={{padding: '4px 0'}}>{moment(lesson.createdTime).format('lll')}</td>
                        <td>{partner.picture ? <img src={partner.picture} style={{borderRadius: '50%', width: 32, height: 32}} /> : ' '}</td>
                        <td>{partner.name ? partner.name : '[kein Name]'}</td>
                        <td>{this.msToString(lesson.duration)}</td>
                        <td style={{textAlign: 'right'}}>{!partner.fake && (partner.myReview ? 'Feedback fertig' : <a href='#'>Feedback abgeben</a>)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
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
