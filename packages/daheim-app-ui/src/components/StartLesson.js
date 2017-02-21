import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage, injectIntl} from 'react-intl'
import styled from 'styled-components'
import Modal from '../Modal'

import {startLesson, leaveIfNotStarted} from '../actions/live'
import ProfilePage, {ProfileHeader} from './profile/PublicProfilePage'
import {levelToString} from './ProficiencyRating'

import {H3, Flex, VSpace, HSpace, Button, CircularProgress} from './Basic'
import {Padding} from '../styles'

const ButtonIcon = styled.img`
  height: 16px;
  object-fit: contain;
  filter: brightness(100);
`

class LessonGuardRaw extends Component {

  static propTypes = {
    lesson: PropTypes.object
  }

  render () {
    const {lesson} = this.props

    if (lesson) {
      return (
        <div style={{display: 'flex', alignItems: 'center', marginTop: 20, marginLeft: 16}}>
          <CircularProgress size={0.25}/>
          <H3 style={{margin: 10}}>Warten auf Gesprächspartner</H3>
        </div>
      )
    } else {
      return (
        <div style={{background: '#FA8072', border: 'solid 1px darkred', padding: 16, color: 'black', margin: '10px 0', borderRadius: 2}}>Student did not accept lesson</div>
      )
    }
  }
}

const LessonGuard = connect((state, props) => {
  const lesson = state.live.lessons[props.lessonId]
  return {lesson}
}, {})(LessonGuardRaw)

class StartLesson extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    startLesson: PropTypes.func.isRequired,
    leaveIfNotStarted: PropTypes.func.isRequired
  }

  state = {
    startLessonPromise: undefined,
    error: undefined,
    lessonId: undefined
  }

  handleStartLesson = async () => {
    if (this.state.startLessonPromise || this.state.lessonId) return

    const startLessonPromise = this.props.startLesson({userId: this.props.user.id})
    this.setState({startLessonPromise, error: undefined})
    try {
      const result = await startLessonPromise
      this.setState({lessonId: result.id})
    } catch (err) {
      this.setState({error: err.message})
    } finally {
      this.setState({startLessonPromise: undefined})
    }
  }

  handleReportUser = _ => {
    // leave conversation when reporting user
    if (this.props.onRequestClose) this.props.onRequestClose()
  }

  async componentWillUnmount () {
    if (this.state.lessonId) {
      this.props.leaveIfNotStarted({id: this.state.lessonId})
    }
    if (this.state.startLessonPromise) {
      try {
        const {id} = await this.state.startLessonPromise
        this.props.leaveIfNotStarted({id})
      } catch (err) {
        // ignore
      }
    }
  }

  render () {
    const {user, onRequestClose, intl} = this.props
    const {startLessonPromise, error, lessonId} = this.state

    return (
      <Modal
        isOpen
        autoScrollBodyContent
        open
        onRequestClose={onRequestClose}
        >
        <Flex column align='center' justify='center'>
          <VSpace v={Padding.l}/>

          <ProfileHeader
            user={user}
            text={intl.formatMessage({id: 'lesson.germanLevel'}, {name: user.name, level: levelToString(user.germanLevel)})}
          />

          <VSpace v={Padding.m}/>

          <Button
            primary
            disabled={!!(startLessonPromise || lessonId)}
            onClick={this.handleStartLesson}
            style={{width: 'auto', height: 'auto', padding: '3px 30px'}}
            >
            <Flex align='center' justify='center'>
              <ButtonIcon src='/icons/Icons_ready-02.svg'/>
              <HSpace v={Padding.s}/>
              <H3><FormattedMessage id='lesson.start'/></H3>
            </Flex>
          </Button>
          {error &&
            <div
              style={{background: '#FA8072', border: 'solid 1px darkred', padding: 16, color: 'black', margin: '10px 0', borderRadius: 2}}
              >
              {error}
            </div>
          }
          {lessonId &&
            <LessonGuard lessonId={lessonId} />
          }
          {startLessonPromise &&
            <div style={{display: 'flex', alignItems: 'center', marginTop: 20, marginLeft: 16}}>
              <CircularProgress size={0.25}/>
              <H3 style={{margin: 10}}>...</H3>
            </div>
          }
        </Flex>

        <VSpace v={Padding.m}/>

        <ProfilePage
          params={{userId: user.id}}
          hideHeader={true}
          reviewEditable={false}
          onRequestClose={this.handleRequestClose}
        />
      </Modal>
    )
  }
}

export default injectIntl(connect(null, {startLesson, leaveIfNotStarted})(StartLesson))
