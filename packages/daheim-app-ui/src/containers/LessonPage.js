import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import styled from 'styled-components'

import {leave, join} from '../actions/live'
import ClosedLesson from '../components/lesson/ClosedLesson'
import {Button, H2, Flex, HSpace} from '../components/Basic'
import {Padding} from '../styles'

const ButtonIcon = styled.img`
  height: 16px;
  object-fit: contain;
  filter: brightness(25);
`

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
      <div style={{position: 'fixed', zIndex: 4, top: 0, bottom: 0, left: 0, right: 0, display: 'flex', background: '#111', color: 'white', alignItems: 'center', justifyContent: 'center'}}>
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
          <Button
            neg
            onClick={this.handleLeave}
            style={{width: 'auto', height: 'auto', padding: '3px 30px'}}
            >
            <Flex align='center' justify='center'>
              <ButtonIcon src='/icons/Icons_ready-01.svg'/>
              <HSpace v={Padding.s}/>
              <H2>Beenden</H2>
            </Flex>
          </Button>
        </div>
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
        <Flex>
          <Button primary onClick={this.handleJoin}>
            <H2>Join</H2>
          </Button>
          <HSpace v={Padding.m}/>
          <Button neg onClick={this.handleLeave}>
            <H2>Close</H2>
          </Button>
        </Flex>
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
          <Button neg onClick={this.handleLeave}>
            <H2>Close lesson</H2>
          </Button>
        </div>
      </div>
    )
  }
}

class LessonOrLoading extends Component {
  static propTypes = {
    lesson: PropTypes.object
  }

  state = {
    lastLesson: this.props.lesson
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.lesson) this.setState({lastLesson: nextProps.lesson})
  }

  render () {
    const {lesson} = this.props
    if (lesson) {
      if (!lesson.participating) return <NotParticipating {...this.props} />
      else if (!lesson.active) return <NotActive {...this.props} />
      else return <LessionPage {...this.props} />
    } else {
      return <ClosedLesson {...this.props} lesson={this.state.lastLesson} />
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
