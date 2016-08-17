import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {FormattedMessage, injectIntl} from 'react-intl'
import Modal from 'react-modal'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'

import {closeAccount, logout} from '../../actions/auth'

class CloseAccount extends Component {
  state = {
    open: false,
    confirmed: false,
    ticket: ''
  }

  openDialog = (e) => this.setState({open: true, confirmed: false})
  onRequestClose = (e) => this.setState({open: false})
  handleCheck = (e, checked) => this.setState({confirmed: checked})
  handleTicketChange = (e) => this.setState({ticket: e.target.value})

  haveHintRef = (hintRef) => {
    if (hintRef) setTimeout(() => hintRef.focus(), 0)
  }

  closeAccount = async () => {
    try {
      await this.props.closeAccount()
      await this.props.logout()
    } finally {
      location.reload()
    }
  }

  render () {
    const {closeAccount, intl, ...otherProps} = this.props
    const {open, confirmed, ticket} = this.state

    return (
      <div {...otherProps}>
        <FlatButton secondary label={intl.formatMessage({id: 'closeAccount.start'})} onClick={this.openDialog} />
        <Modal isOpen={open} onRequestClose={this.onRequestClose}>
          <div style={{maxWidth: 480}}>
            <h1><FormattedMessage id='closeAccount.title' /></h1>

            <div><FormattedMessage id='closeAccount.getHelp.text' /></div>
            <div style={{marginTop: 10}}>
              <textarea ref={this.haveHintRef} placeholder={intl.formatMessage({id: 'closeAccount.getHelp.hint'})} style={{width: '100%', height: 150, borderRadius: 4, fontSize: 14, padding: 6, borderColor: '#AAA'}} value={ticket} onChange={this.handleTicketChange} />
            </div>
            <div style={{marginTop: 10}}>
              <FlatButton style={{marginRight: 12}} label={intl.formatMessage({id: 'closeAccount.cancel'})} onClick={this.onRequestClose} />
              <RaisedButton disabled primary label={intl.formatMessage({id: 'closeAccount.getHelp.submit'})} onClick={this.onRequestClose} />
            </div>

            <div style={{borderBottom: 'solid 1px lightgray', marginTop: 30}}></div>

            <div style={{paddingLeft: 16, marginTop: 30}}>
              <Checkbox checked={confirmed} label={intl.formatMessage({id: 'closeAccount.confirmLabel'})} onCheck={this.handleCheck} />
            </div>
            <div style={{marginTop: 14}}>
              <FlatButton label={intl.formatMessage({id: 'closeAccount.cancel'})} onClick={this.onRequestClose} />
              <FlatButton disabled={!confirmed} secondary label={intl.formatMessage({id: 'closeAccount.submit'})} onClick={this.closeAccount} />
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default injectIntl(connect(null, {closeAccount, logout})(CloseAccount))
