import React, {PropTypes, Component} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import Helmet from 'react-helmet'
import moment from 'moment'
import {Link} from 'react-router'
import {FormattedMessage, injectIntl} from 'react-intl'
import styled from 'styled-components'

import loader from '../../loader'
import {loadUser, sendReview} from '../../actions/users'
import ProficiencyRating from '../ProficiencyRating'

import Review from './Review'
import SendReview from './SendReview'

import {H2, H3, Text, Flex, Box, VSpace, Avatar, Button, Interest, LanguageBox} from '../Basic'
import {Padding, Layout} from '../../styles'

const rowSpacing = Padding.s
const colSpacing = Padding.s
const entryStyle = { marginRight: colSpacing, marginBottom: rowSpacing }
const reviewRowSpacing = Padding.m

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -${rowSpacing};
  margin-right: -${colSpacing};
`

class ProfileHeaderRaw extends Component {
  static propTypes = {
    user: PropTypes.object,
    text: PropTypes.string,
  }

  roleToTitle (role) {
    const {intl} = this.props
    switch (role) {
      case 'student': return intl.formatMessage({id: 'profile.student.long'})
      case 'teacher': return intl.formatMessage({id: 'profile.coach.long'})
      default: return intl.formatMessage({id: 'profile.user'})
    }
  }

  render() {
    if (this.props.user == null) return null // TODO: Why does this happen?
    const {role, name, picture} = this.props.user
    return (
      <Flex column align='center'>
        <Avatar size='100px' src={picture}/>
        <VSpace v={Padding.m}/>
        <H2>{name}</H2>
        <Text>{this.props.text || this.roleToTitle(role)}</Text>
      </Flex>
    )
  }
}

export const ProfileHeader = injectIntl(ProfileHeaderRaw)

class ProfilePage extends Component {

  static propTypes = {
    user: PropTypes.object,
    userMeta: PropTypes.object,
    me: PropTypes.bool,
    reviewEditable: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    onReportUser: PropTypes.func,
    hideHeader: PropTypes.bool,
    fromLesson: PropTypes.bool,
  }

  static defaultProps = {
    reviewEditable: true
  }

  state = {
    editorOpen: false
  }

  handleEditorRequestClose = () => {
    if (this.props.fromLesson) {
      this.props.push('/')
      setTimeout(() => window.location.reload(), 10)
    } else {
      this.setState({editorOpen: false})
    }
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
      case 'student': return intl.formatMessage({id: 'profile.student.long'})
      case 'teacher': return intl.formatMessage({id: 'profile.coach.long'})
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
    const {user, userMeta, me, reviewEditable, fromLesson} = this.props

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
      .map((review) => <Review
        key={review.from}
        {...this.props}
        style={{marginBottom: reviewRowSpacing}}
        review={review}
        reviewEditable={false}
      />)

    return (
      <div style={{maxWidth: '100%', width: Layout.innerWidthPx/2}}>
        <Helmet title={name} />

        {!this.props.hideHeader && <VSpace v={Padding.l}/>}

        <Flex column>
          {!this.props.hideHeader && <ProfileHeader user={user}/>}

          {!this.props.hideHeader && <VSpace v={Padding.l}/>}

          {fromLesson &&
            <div>
              <SendReview
                {...this.props}
                onRequestClose={this.handleEditorRequestClose}
              />
              <VSpace v={Padding.l}/>
            </div>
          }

          {introduction &&
            <div>
              <H3><FormattedMessage id='profile.introduction' values={{name}}/></H3>
              <Text>{introduction}</Text>
              <VSpace v={Padding.m}/>
            </div>
          }

          <H3><FormattedMessage id='profile.topics' values={{name}}/></H3>
          <Container>
            {topicsArr.length === 0 ? (
              <Text><FormattedMessage id='profile.noTopics'/></Text>
            ) : (
              topicsArr.map(topic => <Interest key={topic} interest={topic} style={entryStyle}/>)
            )}
          </Container>

          <VSpace v={Padding.m}/>

          <H3><FormattedMessage id='profile.languages' values={{name}}/></H3>
          <Container>
            {languagesArr.length === 0 ? (
              <Text><FormattedMessage id='profile.noLanguages'/></Text>
            ) : (
              languagesArr.map(language => <LanguageBox key={language} style={entryStyle}>{language}</LanguageBox>)
            )}
          </Container>

          <VSpace v={Padding.l}/>

          {showStudentFields &&
            <div>
              <H3><FormattedMessage id='profile.germanLevel' values={{name}}/></H3>
              <Text><ProficiencyRating value={'' + germanLevel} readOnly/></Text>
              <VSpace v={Padding.m}/>
              <H3><FormattedMessage id='profile.inGermanySince' values={{name}}/></H3>
              <Text>{this.seitToText(inGermanySince)}</Text>
              <VSpace v={Padding.m}/>
            </div>
          }

          <H3><FormattedMessage id='profile.userSince' values={{name}}/></H3>
          <Text>{userSinceText}</Text>

          {!fromLesson && <VSpace v={Padding.l}/>}

          {(myReview || editorOpen) && !fromLesson &&
            <div>
              <H3><FormattedMessage id='profile.myFeedback'/></H3>
              <VSpace v={Padding.s}/>
              <div>
                {(editorOpen) &&
                  <SendReview
                    {...this.props}
                    onRequestClose={this.handleEditorRequestClose}
                  />
                }
                {myReview && !editorOpen &&
                  <Review
                    key={myReview.from}
                    {...this.props}
                    reviewEditable={reviewEditable}
                    review={myReview}
                    onRequestEdit={this.handleOpenEditor}
                  />
                }
              </div>
              <VSpace v={Padding.m}/>
            </div>
          }

          {!fromLesson &&
            <div>
              <H3><FormattedMessage id='profile.feedback'/></H3>
              <VSpace v={Padding.s}/>
              {otherReviews.length !== 0 ? (
                <div style={{marginBottom: `-${reviewRowSpacing}`}}>
                  {otherReviews}
                </div>
              ) : (
                  <Text><FormattedMessage id='profile.noFeedback'/></Text>
              )}

              <VSpace v={Padding.l}/>

              {me &&
                <Flex>
                  <Link to='/profile'><Button neutral><FormattedMessage id='profile.edit'/></Button></Link>
                  <Box auto/>
                </Flex>
              }
              {!me && this.props.onReportUser &&
                <Flex>
                  <Text><a onClick={this.handleReport} href='#'><FormattedMessage id='profile.reportUser'/></a></Text>
                  <Box auto/>
                </Flex>
              }
            </div>
          }
        </Flex>
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
