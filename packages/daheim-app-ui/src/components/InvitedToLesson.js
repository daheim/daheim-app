import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import {Howl} from 'howler'
import Modal from '../Modal'

import {join, leave} from '../actions/live'
import ProfilePage from './profile/PublicProfilePage'

class InvitedToLessonDialog extends Component {

  static propTypes = {
    lesson: PropTypes.object.isRequired,
    join: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (!this.sound) {
      this.sound = new Howl({
        urls: ['https://assets.daheimapp.de/public/assets/lesson.mp3']
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

  render () {
    // const {lesson} = this.props
    // const {id} = lesson

    const actions = [
      <FlatButton
        key='cancel'
        className='cancel'
        label='Abbrechen'
        onTouchTap={this.handleRequestClose}
      />,
      <FlatButton
        key='start'
        className='start'
        label='Gespräch starten'
        primary
        onTouchTap={this.handleAccept}
      />
    ]

    return (
      <Modal isOpen autoScrollBodyContent open modal onRequestClose={this.handleRequestClose} actions={actions} style={{inner: {minWidth: '60%'}}}>
        <div className='invitedToLessonDialog' style={{borderBottom: 'solid 1px rgb(224, 224, 224)', paddingBottom: 8}}>
          {actions}
        </div>
        <h2>Neues Gespräch</h2>
        <ProfilePage params={{userId: this.props.lesson.teacherId}} reviewEditable={false} />
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
  return {lesson}
}, {join, leave})(InvitedToLesson)
