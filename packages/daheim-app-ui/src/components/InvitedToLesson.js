import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import FlatButton from 'material-ui/FlatButton'
import {Howl} from 'howler'
import styled from 'styled-components'
import Modal from '../Modal'

import {join, leave, ready as setReady} from '../actions/live'
import ProfilePage, {ProfileHeader} from './profile/PublicProfilePage'

import {H3, Flex, VSpace, HSpace, Button} from './Basic'
import {Padding} from '../styles'

const ButtonIcon = styled.img`
  height: 16px;
  object-fit: contain;
  filter: brightness(100);
`

class InvitedToLessonDialog extends Component {

  static propTypes = {
    lesson: PropTypes.object.isRequired,
    join: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    setReady: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (!this.sound) {
      this.sound = new Howl({
        src: ['https://assets.willkommen-daheim.org/public/assets/lesson.mp3']
      })
    }

    this.soundInterval = setInterval(() => {
      this.sound.play()
    }, 5000)
    this.sound.play()
  }

  componentWillUnmount () {
    if (this.soundInterval) clearInterval(this.soundInterval)
    if (this.sound) {
      this.sound.unload()
    }
  }

  handleRequestClose = () => {
    this.props.leave({id: this.props.lesson.id})
  }

  handleAccept = () => {
    this.props.join({id: this.props.lesson.id})
  }

  handleReportUser = _ => {
    // unq and leave conversation when reporting user
    this.props.leave({id: this.props.lesson.id})
    this.props.setReady({ready: false})
  }

  render () {
    // const {lesson} = this.props
    // const {id} = lesson

    return (
      <Modal
        isOpen
        autoScrollBodyContent
        open
        modal
        onRequestClose={this.handleRequestClose}
        >
        <Flex column align='center' justify='center'>
          <VSpace v={Padding.l}/>

          <ProfileHeader user={this.props.user}/>

          <VSpace v={Padding.m}/>

          <Button
            primary
            onClick={this.handleAccept}
            style={{width: 'auto', height: 'auto', padding: '3px 30px'}}
            >
            <Flex align='center' justify='center'>
              <ButtonIcon src='/icons/Icons_ready-02.svg'/>
              <HSpace v={Padding.s}/>
              <H3><FormattedMessage id='lesson.accept'/></H3>
            </Flex>
          </Button>
        </Flex>

        <VSpace v={Padding.m}/>

        <ProfilePage
          params={{userId: this.props.lesson.teacherId}}
          hideHeader={true}
          reviewEditable={false}
        />
      </Modal>
    )
  }
}

class InvitedToLesson extends Component {

  static propTypes = {
    lesson: PropTypes.object
  }

  state = {
    lesson: this.props.lesson
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.lesson || !this.props.lesson || this.props.lesson.id !== nextProps.lesson.id) {
      this.setState({lesson: nextProps.lesson})
    }
  }

  render () {
    const {lesson} = this.state
    if (!lesson) return null
    return <InvitedToLessonDialog {...this.props} key={lesson.id} lesson={lesson} />
  }
}

export default connect((state, props) => {
  const {lessons} = state.live
  const keys = Object.keys(lessons)
  let lesson = keys.length ? lessons[keys[0]] : undefined
  if (lesson) {
    if (lesson.connected || lesson.participating) lesson = undefined
  }
  const user = lesson && state.users.users[lesson.teacherId]
  return {lesson, user}
}, {join, leave, setReady})(InvitedToLesson)
