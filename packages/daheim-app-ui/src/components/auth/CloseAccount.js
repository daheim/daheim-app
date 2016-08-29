import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {FormattedMessage, injectIntl} from 'react-intl'
import Checkbox from 'material-ui/Checkbox'

import Modal from '../../Modal'
import {closeAccount, logout} from '../../actions/auth'
import {createTicket} from '../../actions/helpdesk'

class CloseAccount extends Component {

  static propTypes = {
    closeAccount: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    createTicket: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  }

  state = {
    open: false,
    confirmed: false,
    ticket: '',
    getHelpDisabled: false
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
      window.location.reload()
    }
  }

  createTicket = async () => {
    if (this.state.getHelpDisabled) return
    this.setState({getHelpDisabled: true})
    try {
      await this.props.createTicket({description: this.state.ticket, environment: 'Konto schließen'})
      this.setState({open: false, ticket: ''})
      setTimeout(() => window.alert(this.props.intl.formatMessage({id: 'closeAccount.getHelp.sent'})))
    } catch (err) {
      setTimeout(() => window.alert(err.message))
    } finally {
      this.setState({getHelpDisabled: false})
    }
  }

  render () {
    const {closeAccount, intl, logout, createTicket, ...otherProps} = this.props // eslint-disable-line no-unused-vars
    const {open, confirmed, ticket, getHelpDisabled} = this.state

    return (
      <div {...otherProps}>
        <FlatButton secondary label={intl.formatMessage({id: 'closeAccount.start'})} onClick={this.openDialog} />
        <Modal isOpen={open} onRequestClose={this.onRequestClose}>
          <div style={{maxWidth: 480}}>
            <h2><FormattedMessage id='closeAccount.title' /></h2>

            <div style={{fontSize: 14, lineHeight: '150%'}}><FormattedMessage id='closeAccount.getHelp.text' /></div>
            <div style={{marginTop: 14}}>
              <textarea ref={this.haveHintRef} placeholder={intl.formatMessage({id: 'closeAccount.getHelp.hint'})} style={{width: '100%', height: 150, borderRadius: 4, fontSize: 14, padding: 6, borderColor: '#AAA'}} value={ticket} onChange={this.handleTicketChange} />
            </div>
            <div style={{marginTop: 10}}>
              <FlatButton style={{marginRight: 12}} label={intl.formatMessage({id: 'closeAccount.cancel'})} onClick={this.onRequestClose} />
              <RaisedButton primary disabled={getHelpDisabled} label={intl.formatMessage({id: 'closeAccount.getHelp.submit'})} onClick={this.createTicket} />
            </div>

            <div style={{borderBottom: 'solid 1px lightgray', marginTop: 30}} />

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

export default injectIntl(connect(null, {closeAccount, logout, createTicket})(CloseAccount))
