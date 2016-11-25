import React, {PropTypes, Component} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import Helmet from 'react-helmet'
import moment from 'moment'
import {Link} from 'react-router'
import {FormattedMessage, injectIntl} from 'react-intl'

import loader from '../../loader'
import {loadUser, sendReview} from '../../actions/users'
import ProficiencyRating from '../ProficiencyRating'

import Review from './Review'
import SendReview from './SendReview'

import css from './ProfilePage.style'

class ProfilePage extends Component {

  static propTypes = {
    user: PropTypes.object,
    userMeta: PropTypes.object,
    me: PropTypes.bool,
    reviewEditable: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    onReportUser: PropTypes.func
  }

  static defaultProps = {
    reviewEditable: true
  }

  state = {
    editorOpen: false
  }

  handleEditorRequestClose = () => {
    this.setState({editorOpen: false})
  }

  handleOpenEditor = () => {
    this.setState({editorOpen: true})
  }

  handleReport = e => {
    e.preventDefault()
    const {id} = this.props.user
    if (this.props.onReportUser) this.props.onReportUser()
    this.props.push(`/users/${id}/report`)
  }

  roleToTitle (role) {
    const {intl} = this.props
    switch (role) {
      case 'student': return intl.formatMessage({id: 'profile.student'})
      case 'teacher': return intl.formatMessage({id: 'profile.coach'})
      default: return intl.formatMessage({id: 'profile.user'})
    }
  }

  seitToText (seit) {
    const {intl} = this.props
    switch (seit) {
      case '2017': return '2017'
      case '2016': return '2016'
      case '2015': return '2015'
      case '2014': return '2014'
      default: return intl.formatMessage({id: 'profile.earlierThan2014'})
    }
  }

  render () {
    console.log(this.props)

    const {user, userMeta, me, reviewEditable} = this.props

    const userNotFound = userMeta && userMeta.error && userMeta.error.code === 'user_not_found'
    if (userNotFound) {
      return <div style={{margin: 16}}><FormattedMessage id='profile.accountClosed' /></div>
    }

    if (!user) {
      return <div style={{margin: 16}}><FormattedMessage id='profile.loading' /></div>
    }

    const {id, name, picture, role, introduction, inGermanySince, userSince, germanLevel, topics, languages, myReview, receivedReviews} = user

    const editorOpen = !me && reviewEditable && (!myReview || this.state.editorOpen)
    const userSinceText = moment(userSince).format('LL')
    const showStudentFields = role !== 'teacher'

    const topicsArr = Object.keys(topics)
    const languagesArr = Object.keys(languages)

    const otherReviews = receivedReviews
      .filter((review) => !(myReview && review.from === myReview.from))
      .slice(0, 3)
      .map((review) => <Review key={review.from} {...this.props} review={review} reviewEditable={false} />)

    return (
      <div key={id} style={{margin: 16}}>

        <Helmet title={name} />

        <div style={{lineHeight: '150%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: 20, maxWidth: '100%', padding: 10, borderBottom: 'solid 1px #EEE'}}>
          <img src={picture} style={{width: 68, height: 68, borderRadius: '50%', marginTop: 6, marginRight: 20, boxShadow: '0 1px 1px 1px rgba(0,0,0,.1)', border: 'solid 2px white'}} />
          <div>
            <div style={{fontSize: 30, fontWeight: 600, fontFamily: 'Lato, sans-serif', lineHeight: '150%'}}>
              <span style={{marginRight: 10}}>{name} </span>
              {me ? <Link to='/profile' className={css.editButton}><FormattedMessage id='profile.edit' /></Link> : null}
              {!me && this.props.onReportUser ? <a onClick={this.handleReport} href='#' className={css.editButton}><FormattedMessage id='profile.reportUser' /></a> : null}
            </div>
            <div style={{fontSize: 14, fontFamily: 'Lato, sans-serif', lineHeight: '150%'}}>{this.roleToTitle(role)}</div>
          </div>
        </div>

        <div style={{minHeight: 200}}>

          {(myReview || editorOpen) ? (
            <div className={css.section}>
              <div className={css.sectionTitle}><FormattedMessage id='profile.myFeedback' /></div>
              <div className={css.sectionContent}>
                {editorOpen ? (
                  <div className={css.field}>
                    <div className={css.fieldText}>
                      <SendReview {...this.props} onRequestClose={this.handleEditorRequestClose} />
                    </div>
                  </div>
                ) : undefined}

                {myReview ? <Review key={myReview.from} {...this.props} reviewEditable={reviewEditable} review={myReview} onRequestEdit={this.handleOpenEditor} /> : undefined}
              </div>
            </div>
          ) : null}

          <div className={css.section}>
            <div className={css.sectionTitle}><FormattedMessage id='profile.personalDetails' /></div>
            <div className={css.sectionContent}>
              <div className={css.field}>
                <div className={css.fieldTitle}><FormattedMessage id='profile.introduction' values={{name}} /></div>
                <div className={css.fieldText}>
                  {introduction || <i><FormattedMessage id='profile.noIntroduction' /></i>}
                </div>
              </div>
              {showStudentFields ? (
                <div className={css.field}>
                  <div className={css.fieldTitle}><FormattedMessage id='profile.inGermanySince' values={{name}} /></div>
                  <div className={css.fieldText}>{this.seitToText(inGermanySince)}</div>
                </div>
              ) : null}
              <div className={css.field}>
                <div className={css.fieldTitle}><FormattedMessage id='profile.topics' values={{name}} /></div>
                <div className={css.fieldText}>
                  {topicsArr.length === 0 ? <i><FormattedMessage id='profile.noTopics' /></i> : (
                    topicsArr.map((topic) => <span key={topic} style={{border: 'solid 1px black', padding: 3, margin: 4, display: 'inline-block'}}>{topic}</span>)
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={css.section}>
            <div className={css.sectionTitle}><FormattedMessage id='profile.experience' /></div>
            <div className={css.sectionContent}>
              {showStudentFields ? (
                <div className={css.field}>
                  <div className={css.fieldTitle}><FormattedMessage id='profile.germanLevel' /></div>
                  <div className={css.fieldText}><ProficiencyRating value={'' + germanLevel} readOnly /></div>
                </div>
              ) : null}
              <div className={css.field}>
                <div className={css.fieldTitle}><FormattedMessage id='profile.languages' values={{name}} /></div>
                <div className={css.fieldText}>
                  {languagesArr.length === 0 ? <i><FormattedMessage id='profile.noLanguages' /></i> : (
                    languagesArr.map((language) => <span key={language} style={{border: 'solid 1px black', padding: 3, margin: 4, display: 'inline-block'}}>{language}</span>)
                  )}
                </div>
              </div>
              <div className={css.field}>
                <div className={css.fieldTitle}><FormattedMessage id='profile.userSince' values={{name}} /></div>
                <div className={css.fieldText}>{userSinceText}</div>
              </div>
            </div>
          </div>

          <div className={css.section}>
            <div className={css.sectionTitle}><FormattedMessage id='profile.feedback' /></div>
            <div className={css.sectionContent}>
              <div className={css.fieldText}>
                {otherReviews.length ? otherReviews : <i><FormattedMessage id='profile.noFeedback' /></i>}
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

const loaded = loader({
  shouldReload (prevProps, nextProps) {
    return prevProps.userId !== nextProps.userId
  },

  isLoaded (props) {
    return props.user || (props.userMeta && !props.userMeta.loading)
  },

  load (nextProps) {
    const {userMeta} = nextProps
    const {loading} = userMeta || {}

    if (!loading) nextProps.loadUser({id: nextProps.userId}).catch((err) => err)
  },

  key (props) {
    return props.user ? props.user.id : props.userId
  }
})(ProfilePage)

export default injectIntl(connect((state, props) => {
  let {userId} = props.params
  userId = userId.toLowerCase()

  const user = state.users.users[userId]
  const userMeta = state.users.usersMeta[userId]
  const {profile: {profile}} = state
  const me = profile.id === userId
  return {me, user, userMeta, userId}
}, {push, loadUser, sendReview})(loaded))
