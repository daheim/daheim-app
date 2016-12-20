import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl'

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
    window.location.href = 'https://daheimapp.de/newsletter/'
  }

  render () {
    return (
      <div style={{textAlign: 'center'}} className='notYetOpen'>
        <div style={{marginBottom: 30}}><img style={{width: 200}} src='https://assets.willkommen-daheim.org/media/Newsletter-Bilder_RGB-06-1.png' /></div>
        <div style={{lineHeight: '150%', marginBottom: 30}}>
          <FormattedHTMLMessage id='notYetOpenPage.paragraph' />
        </div>
        <div style={{lineHeight: '150%', marginBottom: 10}}>
          <FormattedMessage id='notYetOpenPage.dontWantToMissTheOfficialStart_signUpForNewsletter' /><br />
        </div>
        <div style={{marginBottom: 30}}>
          <RaisedButton style={{margin: '0 20px'}} label='Für unseren Newsletter anmelden' primary onClick={this.newsletter} />
        </div>
        <div style={{lineHeight: '150%', marginBottom: 10}}>
          <FormattedMessage id='notYetOpenPage.wantToBrowse_enjoy' /><br />
        </div>
        <div style={{marginBottom: 30}}>
          <FlatButton className='accept' style={{margin: '0 20px'}} label='Fortfahren' onClick={this.accept} />
        </div>
      </div>
    )
  }
}

export default connect(null, {acceptNotYetOpen})(NotYetOpenPage)
