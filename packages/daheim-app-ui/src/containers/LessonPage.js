import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'

import {leave, join} from '../actions/live'

class ResizedVideo extends Component {

  static propTypes = {
    onResize: PropTypes.func
  }

  componentDidMount () {
    this.refs.video.addEventListener('resize', this.handleResize)
  }

  handleResize = (e) => {
    if (this.props.onResize) this.props.onResize(e)
  }

  render () {
    return <video ref='video' {...this.props} />
  }
}

class LessionPage extends React.Component {

  static propTypes = {
    lesson: PropTypes.object.isRequired,
    leave: PropTypes.func.isRequired,
    join: PropTypes.func.isRequired
  }

  state = {
    remoteVideoWidth: 200,
    remoteVideoHeight: undefined
  }

  handleLeave = () => {
    this.props.leave({id: this.props.lesson.id})
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleContainerResize)
    this.resizeVideos()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleContainerResize)
  }

  handleContainerResize = (e) => {
    this.resizeVideos()
  }

  handleRemoteVideoResize = (e) => {
    const {target} = e

    const readSize = () => {
      const {videoWidth, videoHeight} = target
      this.remoteWidth = videoWidth
      this.remoteHeight = videoHeight
      this.resizeVideos()
    }

    // arbitrary delay, because on Chrome the new video size is
    // not yet available during the event
    setTimeout(readSize, 100)
    readSize()
  }

  resizeVideos () {
    if (this.remoteWidth && this.remoteHeight) {
      const ratio = this.remoteHeight / this.remoteWidth
      const maxw = window.innerWidth
      const maxh = window.innerHeight

      let remoteVideoWidth = maxw
      let remoteVideoHeight = remoteVideoWidth * ratio
      if (remoteVideoHeight > maxh) {
        remoteVideoHeight = maxh
        remoteVideoWidth = remoteVideoHeight / ratio
      }

      this.setState({remoteVideoWidth, remoteVideoHeight})
    }
  }

  render () {
    const {lesson} = this.props
    const {remoteStreamUrl, localStreamUrl} = lesson
    const {remoteVideoWidth, remoteVideoHeight} = this.state

    return (
      <div style={{position: 'fixed', zIndex: 3, top: 0, bottom: 0, left: 0, right: 0, display: 'flex', background: '#111', color: 'white', alignItems: 'center', justifyContent: 'center'}}>
        {remoteStreamUrl ? (
          <div>
            <div style={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, right: 0, bottom: 0}}>
              <ResizedVideo className='remoteVideo' width={remoteVideoWidth} height={remoteVideoHeight} autoPlay src={remoteStreamUrl} onResize={this.handleRemoteVideoResize} />
            </div>
            <div style={{position: 'absolute', bottom: 10, right: 10}}>
              <video className='localVideo' height='100' style={{transform: 'rotateY(180deg)'}} autoPlay muted src={localStreamUrl} />
            </div>
          </div>
        ) : (
          <div>
            <div style={{textAlign: 'center'}}><CircularProgress /></div>
            <div style={{textAlign: 'center'}}>Du wirst verbunden...</div>
          </div>
        )}
        <div style={{position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <RaisedButton className='finishLesson' label='Gespräch beenden' primary onClick={this.handleLeave} />
        </div>
      </div>
    )
  }
}

class ClosedLesson extends Component {
  static propTypes = {
    closeReason: PropTypes.string.isRequired
  }

  render () {
    const {closeReason} = this.props

    return (
      <div style={{margin: 16}}>
        <h1>Das Gespräch wurde beendet</h1>
        <p><Link to='/'>Hier gelangst du zum Videoraum</Link></p>
        <p style={{color: 'rgba(0, 0, 0, 0)'}}>Reason: {closeReason}</p>
      </div>
    )
  }
}

class NotParticipating extends Component {

  static propTypes = {
    lesson: PropTypes.object.isRequired,
    leave: PropTypes.func.isRequired,
    join: PropTypes.func.isRequired
  }

  handleLeave = () => {
    this.props.leave({id: this.props.lesson.id})
  }

  handleJoin = () => {
    this.props.join({id: this.props.lesson.id})
  }

  render () {
    return (
      <div style={{margin: 16}}>
        <h1>Join Lesson</h1>
        <div>
          <RaisedButton label='Join Lesson' primary onClick={this.handleJoin} />
          <FlatButton label='Close Lesson' onClick={this.handleLeave} />
        </div>
      </div>
    )
  }
}

class NotActive extends Component {
  static propTypes = {
    lesson: PropTypes.object.isRequired,
    leave: PropTypes.func.isRequired
  }

  handleLeave = () => {
    this.props.leave({id: this.props.lesson.id})
  }

  render () {
    return (
      <div style={{margin: 16}}>
        <h1>Waiting for student to connect...</h1>
        <div>
          <RaisedButton label='Close Lesson' primary onClick={this.handleLeave} />
        </div>
      </div>
    )
  }
}

class LessonOrLoading extends Component {
  static propTypes = {
    lesson: PropTypes.object
  }

  render () {
    const {lesson} = this.props
    if (lesson) {
      if (!lesson.participating) return <NotParticipating {...this.props} />
      else if (!lesson.active) return <NotActive {...this.props} />
      else return <LessionPage {...this.props} />
    } else {
      return <ClosedLesson {...this.props} />
    }
  }
}

export default connect((state, props) => {
  const {lessonId} = props.params
  const lesson = state.live.lessons[lessonId]
  const closedLesson = state.live.closedLessons[lessonId]
  const closeReason = closedLesson ? closedLesson.closeReason : 'notFound'
  return {lesson, closeReason}
}, {leave, join})(LessonOrLoading)
