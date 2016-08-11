import React, {Component} from 'react'

import RoleSwitch from '../RoleSwitch'

export default class AdminPage extends Component {
  render () {
    return (
      <div style={{margin: 16}}>
        <h2>Change User Role</h2>
        <div><RoleSwitch /></div>
      </div>
    )
  }
}
