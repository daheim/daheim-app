import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import RaisedButton from 'material-ui/RaisedButton'
import {FormattedMessage, injectIntl} from 'react-intl'
import {createTicket} from '../../actions/helpdesk'

const alert = window.alert

class HelpPage extends Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    createTicket: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  }

  state = {
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

  createTicket = async () => {
    if (this.state.getHelpDisabled) return
    this.setState({getHelpDisabled: true})
    try {
      await this.props.createTicket({description: this.state.ticket, environment: 'Hilfebereich'})
      this.setState({open: false, ticket: ''})
      setTimeout(() => {
        alert(this.props.intl.formatMessage({id: 'help.sent'}))
        this.props.push('/')
      })
    } catch (err) {
      setTimeout(() => alert(err.message))
    } finally {
      this.setState({getHelpDisabled: false})
    }
  }

  render () {
    const {push, intl, createTicket, ...otherProps} = this.props // eslint-disable-line no-unused-vars
    const {ticket, getHelpDisabled} = this.state

    return (
      <div {...otherProps} style={{margin: 16, maxWidth: 480}}>
        <h2><FormattedMessage id='help.title' /></h2>

        <div style={{fontSize: 14, lineHeight: '150%'}}><FormattedMessage id='help.goToHelpArea' /></div>
        <ul style={{fontSize: 20, lineHeight: '200%', marginTop: 21}}>
          <li><a href='https://willkommen-daheim.org/international/' target='_blank'><FormattedMessage id='help.manual' /></a></li>
          <li><a href='https://willkommen-daheim.org/faq/' target='_blank'><FormattedMessage id='help.faq' /></a></li>
          <li><a href='https://willkommen-daheim.org/community/' target='_blank'><FormattedMessage id='help.houseRules' /></a></li>
        </ul>

        <div style={{borderBottom: 'solid 1px lightgray', marginTop: 30}} />

        <div style={{fontSize: 14, lineHeight: '150%', marginTop: 30}}><FormattedMessage id='help.text' /></div>
        <div style={{marginTop: 14}}>
          <textarea ref={this.haveHintRef} placeholder={intl.formatMessage({id: 'help.hint'})} style={{width: '100%', height: 150, borderRadius: 4, fontSize: 14, padding: 6, borderColor: '#AAA'}} value={ticket} onChange={this.handleTicketChange} />
        </div>
        <div style={{marginTop: 10}}>
          <RaisedButton primary disabled={getHelpDisabled} label={intl.formatMessage({id: 'help.submit'})} onClick={this.createTicket} />
        </div>
      </div>
    )
  }
}

export default injectIntl(connect(null, {push, createTicket})(HelpPage))
