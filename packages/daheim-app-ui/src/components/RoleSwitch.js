import React, {PropTypes} from 'react'
import RadioButton, {RadioButtonGroup} from 'material-ui/RadioButton'
import {connect} from 'react-redux'

import {switchRole} from '../actions/profile'

export default class RoleSwitch extends React.Component {

  static propTypes = {
    switchRole: PropTypes.func.isRequired,
    profile: PropTypes.object
  }

  handleChange = (e, value) => {
    this.props.switchRole(value)
  }

  render () {
    const {profile: {role} = {}} = this.props.profile || {}
    return (
      <RadioButtonGroup name='role' onChange={this.handleChange} valueSelected={role}>
        <RadioButton value='teacher' label='Teacher' />
        <RadioButton value='student' label='Student' />
        <RadioButton value='not-yet-chosen' label='Not yet chosen' />
      </RadioButtonGroup>
    )
  }
}

export default connect((state) => {
  const {profile, loading} = state.profile
  return {profile, loading}
}, {switchRole})(RoleSwitch)

