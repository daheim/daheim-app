import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

import {acceptNotYetOpen} from '../../actions/not_yet_open'

class NotYetOpenPage extends Component {

  static propTypes = {
    acceptNotYetOpen: PropTypes.func.isRequired
  }

  accept = (e) => {
    e.preventDefault()
    this.props.acceptNotYetOpen()
  }

  newsletter = (e) => {
    e.preventDefault()
    location.href = 'https://daheimapp.de/newsletter/'
  }

  render () {
    return (
      <div style={{textAlign: 'center'}} className='notYetOpen'>
        <h1>Schön, dass du da bist!</h1>
        <div style={{marginBottom: 30}}><img style={{width: 200}} src='https://assets.daheimapp.de/media/Daheim_Baustelle.svg' /></div>
        <div style={{lineHeight: '150%', marginBottom: 30}}>
          Du willst noch vor Beginn dabei sein und testen?<br/>
          Sag uns gern Bescheid: <a href='mailto:hallo@willkommen-daheim.org'>hallo@willkommen-daheim.org</a>!
        </div>

        <div style={{lineHeight: '150%', marginBottom: 10}}>
          Du willst den offiziellen Start nicht verpassen? Melde dich für den Newsletter an:<br/>
        </div>
        <div style={{marginBottom: 30}}>
          <RaisedButton style={{margin: '0 20px'}} label='Für unseren Newsletter anmelden' primary onClick={this.newsletter} />
        </div>

        <div style={{lineHeight: '150%', marginBottom: 10}}>
          Du willst Dich trotzdem umschauen? Viel Spaß!<br/>
        </div>
        <div style={{marginBottom: 30}}>
          <FlatButton className='accept' style={{margin: '0 20px'}} label='Fortfahren' onClick={this.accept} />
        </div>
      </div>
    )
  }
}

export default connect(null, {acceptNotYetOpen})(NotYetOpenPage)
