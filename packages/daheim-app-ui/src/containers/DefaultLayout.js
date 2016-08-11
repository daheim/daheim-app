import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {connect as liveConnect} from '../actions/live'
import {loadProfile} from '../actions/profile'

import Header from '../components/Header'
import InvitedToLesson from '../components/InvitedToLesson'

class DefaultLayout extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
    liveConnect: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.liveConnect() // TODO: handle unmount
  }

  render () {
    return (
      <div style={{flex: '1 1 auto'}}>
        <Header />
        <div style={{clear: 'both', background: 'white', maxWidth: 960, margin: '0 auto', border: 'solid 1px #DDD', position: 'relative'}}>
          {this.props.children}
        </div>
        <InvitedToLesson />
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
}, {liveConnect, loadProfile})(DefaultLayoutOrLoad)
