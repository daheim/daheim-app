import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {FormattedMessage, injectIntl} from 'react-intl'
import {push} from 'react-router-redux'

import {reportUser} from '../../actions/helpdesk'
import {loadUser} from '../../actions/users'

class ReportUserPage extends Component {

  static propTypes = {
    loadUser: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    reportUser: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    user: PropTypes.object
  }

  state = {
    ticket: '',
    submitDisabled: false
  }

  componentDidMount () {
    this.props.loadUser({id: this.props.userId}).catch((err) => err)
    if (this.refs.ticket) this.refs.ticket.focus()
  }

  cancel = () => this.props.push(`/users/${this.props.userId}`)
  handleTicketChange = (e) => this.setState({ticket: e.target.value})

  createTicket = async () => {
    if (this.state.submitDisabled) return
    this.setState({submitDisabled: true})
    try {
      await this.props.reportUser({description: this.state.ticket, offendingUserId: this.props.userId})
      setTimeout(() => this.props.push('/'))
      setTimeout(() => alert(this.props.intl.formatMessage({id: 'reportUser.sent'})))
    } catch (err) {
      setTimeout(() => alert(err.message))
    } finally {
      this.setState({submitDisabled: false})
    }
  }

  render () {
    const {user, userId, intl} = this.props
    const {ticket, submitDisabled} = this.state

    const name = user && user.name || intl.formatMessage({id: 'reportUser.loadingName'})

    return (
      <div key={userId} style={{maxWidth: 480, margin: 16}}>
        <h2><FormattedMessage id='reportUser.title' /></h2>

        <div style={{fontSize: 14, lineHeight: '150%'}}>
          <FormattedMessage id='reportUser.text' values={{
            houseRulesLink: <a href="https://willkommen-daheim.org/" target="_blank"><FormattedMessage id='reportUser.houseRulesLinkText' /></a>
          }} />
        </div>
        <div style={{marginTop: 14, fontSize: 14}}><FormattedMessage id='reportUser.offendingUser' values={{name}} /></div>
        <div style={{marginTop: 14}}>
          <textarea ref='ticket' placeholder={intl.formatMessage({id: 'reportUser.hint'})} style={{width: '100%', height: 150, borderRadius: 4, fontSize: 14, padding: 6, borderColor: '#AAA'}} value={ticket} onChange={this.handleTicketChange} />
        </div>

        <div style={{marginTop: 10}}>
          <FlatButton style={{marginRight: 12}} label={intl.formatMessage({id: 'reportUser.cancel'})} onClick={this.cancel} />
          <RaisedButton primary disabled={submitDisabled} label={intl.formatMessage({id: 'reportUser.submit'})} onClick={this.createTicket} />
        </div>

      </div>
    )
  }
}

export default injectIntl(connect((state, props) => {
  let {userId} = props.params
  userId = userId.toLowerCase()
  const user = state.users.users[userId]
  return {userId, user}
}, {reportUser, loadUser, push})(ReportUserPage))
