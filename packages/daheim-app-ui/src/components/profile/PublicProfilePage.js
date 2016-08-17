import React, {PropTypes, Component} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import Helmet from 'react-helmet'
import moment from 'moment'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import loader from '../../loader'
import {loadUser, sendReview} from '../../actions/users'
import ProficiencyRating from '../ProficiencyRating'

import Review from './Review'
import SendReview from './SendReview'

import css from './ProfilePage.style'

function roleToTitle (role) {
  switch (role) {
    case 'student': return 'Daheim SchülerIn'
    case 'teacher': return 'Daheim SprachcoachIn'
    default: return 'Daheim BenutzerIn'
  }
}

function seitToText (seit) {
  switch (seit) {
    case '2017': return '2017'
    case '2016': return '2016'
    case '2015': return '2015'
    case '2014': return '2014'
    default: return 'Früher als 2014'
  }
}

class ProfilePage extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    me: PropTypes.bool
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

  render () {
    const {user, userMeta, me} = this.props

    const userNotFound = userMeta && userMeta.error && userMeta.error.code === 'user_not_found'
    if (userNotFound) {
      return <div style={{margin: 16}}>Benuzter Konto abgeschlossen</div>
    }

    const {id, name, picture, role, introduction, inGermanySince, userSince, germanLevel, topics, languages, myReview, receivedReviews} = user

    const editorOpen = !me && (!myReview || this.state.editorOpen)
    const userSinceText = moment(userSince).format('LL')
    const showStudentFields = role !== 'teacher'

    const topicsArr = Object.keys(topics)
    const languagesArr = Object.keys(languages)

    return (
      <div key={id} style={{margin: 16}}>

        <Helmet title={name} />

        <div style={{lineHeight: '150%', display: 'flex', alignItems: 'center', marginBottom: 20, maxWidth: '100%', padding: 10, borderBottom: 'solid 1px #EEE'}}>
          <img src={picture} style={{width: 68, height: 68, borderRadius: '50%', marginTop: 6, boxShadow: '0 1px 1px 1px rgba(0,0,0,.1)', border: 'solid 2px white'}} />
          <div style={{marginLeft: 20}}>
            <div style={{fontSize: 30, fontWeight: 600, fontFamily: 'Lato, sans-serif', lineHeight: '150%'}}>
              {name}
              {me ? <Link to='/profile' className={css.editButton}><FormattedMessage id='profile.edit' /></Link> : null}
            </div>
            <div style={{fontSize: 14, fontFamily: 'Lato, sans-serif', lineHeight: '150%'}}>{roleToTitle(role)}</div>
          </div>
        </div>

        <div style={{minHeight: 200}}>

          <div className={css.section}>
            <div className={css.sectionTitle}>Personendaten</div>
            <div className={css.sectionContent}>
              <div className={css.field}>
                <div className={css.fieldTitle}>Ein Paar Worte über mich</div>
                <div className={css.fieldText}>
                  {introduction || <i>Es gibt noch keine Informationen.</i>}
                </div>
              </div>
              {showStudentFields ? (
                <div className={css.field}>
                  <div className={css.fieldTitle}>Ich wohne in Deutschland seit</div>
                  <div className={css.fieldText}>{seitToText(inGermanySince)}</div>
                </div>
              ) : null}
              <div className={css.field}>
                <div className={css.fieldTitle}>Ich spreche gern über...</div>
                <div className={css.fieldText}>
                  {topicsArr.length === 0 ? <i>Noch keine Themen</i> : (
                    topicsArr.map((topic) => <span key={topic} style={{border: 'solid 1px black', padding: 3, margin: 4, display: 'inline-block'}}>{topic}</span>)
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={css.section}>
            <div className={css.sectionTitle}>Erfahrung</div>
            <div className={css.sectionContent}>
              {showStudentFields ? (
                <div className={css.field}>
                  <div className={css.fieldTitle}>Deutschkenntnis</div>
                  <div className={css.fieldText}><ProficiencyRating value={'' + germanLevel} readOnly /></div>
                </div>
              ) : null}
              <div className={css.field}>
                <div className={css.fieldTitle}>Ich spreche auch...</div>
                <div className={css.fieldText}>
                  {languagesArr.length === 0 ? <i>Keine andere Sprachen</i> : (
                    languagesArr.map((language) => <span key={language} style={{border: 'solid 1px black', padding: 3, margin: 4, display: 'inline-block'}}>{language}</span>)
                  )}
                </div>
              </div>
              <div className={css.field}>
                <div className={css.fieldTitle}>Ich nutze Daheim seit</div>
                <div className={css.fieldText}>{userSinceText}</div>
              </div>
              <div className={css.field}>
                <div className={css.fieldTitle}>Bisherige Gespräche auf Daheim</div>
                <div className={css.fieldText}>4 Gespräche, 1 Stunde 47 Minuten</div>
              </div>
            </div>
          </div>

          <div className={css.section}>
            <div className={css.sectionTitle}>Feedback</div>
            <div className={css.sectionContent}>
              {editorOpen ? (
                <div className={css.field}>
                  <div className={css.fieldTitle}>Dein Feedback</div>
                  <div className={css.fieldText}>
                    <SendReview {...this.props} onRequestClose={this.handleEditorRequestClose} />
                  </div>
                </div>
              ) : undefined}

              {myReview ? <Review key={myReview.from} {...this.props} mine review={myReview} onRequestEdit={this.handleOpenEditor} /> : undefined}

              {receivedReviews.map((review) => {
                if (myReview && review.from === myReview.from) return
                return <Review key={review.from} {...this.props} review={review} />
              })}

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

    if (!loading) nextProps.loadUser({id: nextProps.userId}).catch((err) => null)
  },

  key (props) {
    return props.user ? props.user.id : props.userId
  }
})(ProfilePage)

export default connect((state, props) => {
  let {userId} = props.params
  userId = userId.toLowerCase()

  const user = state.users.users[userId]
  const userMeta = state.users.usersMeta[userId]
  const {profile: {profile}} = state
  const me = profile.id === userId
  return {me, user, userMeta, userId}
}, {push, loadUser, sendReview})(loaded)
