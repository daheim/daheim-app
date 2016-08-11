import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import {switchRole} from '../../actions/profile'
import {connect as liveConnect} from '../../actions/live'

class TimeToChoose extends Component {
  static propTypes = {
    switchRole: PropTypes.func.isRequired,
    liveConnect: PropTypes.func.isRequired,
    profile: PropTypes.object
  }

  student = async () => {
    await this.props.switchRole('student')
    this.props.liveConnect()
  }

  teacher = async () => {
    await this.props.switchRole('teacher')
    this.props.liveConnect()
  }

  render () {
    if (!this.props.profile) return null

    const {profile: {role} = {}} = this.props.profile || {}
    if (role === 'teacher' || role === 'student') return null

    return (
      <div>
        <h2>Wer bist du?</h2>
        <div style={{display: 'flex'}}>
          <div style={{flex: '0 0 auto', fontSize: 20, fontWeight: 700, margin: 20, padding: 20}}>
            <div style={{textAlign: 'center', marginBottom: 10}}>Bist du Sprachschüler?</div>
            <div style={{textAlign: 'center'}}><RaisedButton label='Schüler' primary onClick={this.student} /></div>
          </div>
          <div style={{flex: '0 0 auto', fontSize: 20, fontWeight: 700, margin: 20, padding: 20}}>
            <div style={{textAlign: 'center', marginBottom: 10}}>Bist du Sprachcoach?</div>
            <div style={{textAlign: 'center'}}><RaisedButton label='Sprachcoach' primary onClick={this.teacher} /></div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state, props) => {
  const {profile} = state.profile
  return {profile}
}, {switchRole, liveConnect})(TimeToChoose)
