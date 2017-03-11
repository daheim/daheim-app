import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage, injectIntl} from 'react-intl'
import styled from 'styled-components'

import Modal from '../../Modal'
import {closeAccount, logout} from '../../actions/auth'
import {createTicket} from '../../actions/helpdesk'

import {H2, Button, Flex, Box, HSpace, VSpace, Text, TextArea, Checkbox} from '../Basic'
import {Layout, Padding, Color} from '../../styles'

const ButtonIcon = styled.img`
  height: 20px;
  object-fit: contain;
  filter: brightness(100);
`

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
      <div>
        <Button neg onClick={this.openDialog} style={{width: 'auto', paddingLeft: 30, paddingRight: 40}}>
          <Flex align='center' justify='center'>
            <ButtonIcon src='/icons/Icons_ready-29.svg'/>
            <HSpace v={Padding.s}/>
            <FormattedMessage id='closeAccount.start'/>
          </Flex>
        </Button>
        <Modal color={Color.red} isOpen={open} onRequestClose={this.onRequestClose} contentLabel={''}>
          <div style={{maxWidth: Layout.innerWidthPx / 1.5}}>
            <Flex justify='center'><H2><FormattedMessage id='closeAccount.title'/></H2></Flex>
            <VSpace v={Padding.m}/>
            <Text><FormattedMessage id='closeAccount.getHelp.text' /></Text>
            <VSpace v={Padding.m}/>
            <TextArea
              innerRef={this.haveHintRef}
              placeholder={intl.formatMessage({id: 'closeAccount.getHelp.hint'})}
              style={{color: Color.red, borderColor: Color.red}}
              value={ticket}
              onChange={this.handleTicketChange}
            />
            <VSpace v={Padding.s}/>
            <Button
              neg
              disabled={getHelpDisabled}
              onClick={this.createTicket}
              >
              <H2><FormattedMessage id='closeAccount.getHelp.submit'/></H2>
            </Button>

            <VSpace v={Padding.m}/>

            <Checkbox
              type='neg'
              style={{marginLeft: Padding.m, maxWidth: Layout.innerWidthPx / 2.5}}
              checked={confirmed}
              label={intl.formatMessage({id: 'closeAccount.confirmLabel'})}
              onCheck={this.handleCheck}
            />

            <VSpace v={Padding.m}/>

            <Flex>
              <Button
                style={{padding: '3px 30px'}}
                primary
                onClick={this.onRequestClose}
                >
                <H2><FormattedMessage id='closeAccount.cancel'/></H2>
              </Button>
              <Box auto style={{minWidth: Padding.grid}}/>
              <Button
                style={{width: 'auto', padding: '3px 30px'}}
                neg
                disabled={!confirmed}
                onClick={this.closeAccount}
                >
                <H2><FormattedMessage id='closeAccount.submit'/></H2>
              </Button>
            </Flex>
          </div>
        </Modal>
      </div>
    )
  }
}

export default injectIntl(connect(null, {closeAccount, logout, createTicket})(CloseAccount))
