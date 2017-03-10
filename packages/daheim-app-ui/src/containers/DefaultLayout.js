import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {connect as liveConnect} from '../actions/live'
import {loadProfile} from '../actions/profile'

import Modal from '../Modal'
import Header from '../components/Header'
import InvitedToLesson from '../components/InvitedToLesson'
import {Layout} from '../styles'

// See https://github.com/ReactTraining/react-router/issues/1808
class DefaultLayout extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
    liveConnect: PropTypes.func.isRequired
  }

  previousChildren = null

  componentWillReceiveProps(nextProps) {
    const isOldModal = this.props.children.props.route.modal
    const isNewModal = nextProps.children.props.route.modal
    if (nextProps.location.key !== this.props.location.key && !isOldModal && isNewModal) {
      this.previousChildren = this.props.children
    }
  }

  componentDidMount () {
    this.props.liveConnect() // TODO: handle unmount
  }

  handleCloseModal = () => {
    const backTo = this.props.children.props.route.backTo
    if (backTo) {
      this.props.push(backTo)
      // TODO: Not good, but I found no better way to circumvent the following situation:
      // Botch finish conversation. Then teacher closes 'Conversation finished' popup and gets
      // back to main page. However, the start lesson modal is still visible and it shows an error message.
      window.location.reload()
    } else {
      window.history.back()
    }
  }

  render () {
    const {children, location} = this.props
    const isModal = children.props.route.modal
    const modalColor = children.props.route.modalColor
    return (
      <div>
        <Header/>
        <div style={{flex: '1 1 auto', marginBottom: 30}}>
          <div style={{
            clear: 'both',
            minHeight: 200,
            background: 'white',
            maxWidth: Layout.width,
            margin: `${Layout.topbarHeight} auto 0 auto`,
            padding: Layout.paddingPx,
            position: 'relative'
            }}>
            {isModal ?
              this.previousChildren :
              children
            }

            {isModal &&
              <Modal isOpen={true} color={modalColor} onRequestClose={this.handleCloseModal}>
                {children}
              </Modal>
            }
          </div>
          <InvitedToLesson />
        </div>
      </div>
    )
  }
}

class DefaultLayoutOrLoad extends Component {

  static propTypes = {
    profile: PropTypes.object,
    error: PropTypes.string,
    loadProfile: PropTypes.func.isRequired
  }

  componentDidMount () {
    if (!this.props.profile) this.props.loadProfile()
  }

  render () {
    const {profile, error} = this.props

    if (profile) return <DefaultLayout {...this.props} />

    if (error) {
      return (
        <div style={{marginTop: 100, textAlign: 'center'}}>
          <div>Fehler: {error}</div>
          <div><a href='javascript:location.reload()'>Neuladen</a></div>
        </div>
      )
    }

    return (
      <div>Laden...</div>
    )
  }
}

export default connect((state, props) => {
  const {profile, error} = state.profile
  return {profile, error}
}, {liveConnect, loadProfile, push})(DefaultLayoutOrLoad)
