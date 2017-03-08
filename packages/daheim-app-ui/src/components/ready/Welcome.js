import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'

import Modal from '../../Modal'
import {NotificationSettingsSmall} from '../settings/NotificationSettings'

import {H1, H2, Text, Flex, Box, VSpace, HSpace, Button} from '../Basic'
import {Layout, Color, Padding} from '../../styles'

import {sawRules} from '../../actions/profile'

const Icon = styled.img`
  height: 50px;
  object-fit: contain;
  filter: hue-rotate(190deg) brightness(1.6) grayscale(0.3);
`

const Icon2 = styled.img`
  height: 50px;
  object-fit: contain;
  filter: hue-rotate(50deg) brightness(1.2) grayscale(0.3);
`

class WelcomeRaw extends React.Component {
  state = {
    open: true,
    step: 0,
  }

  handleCloseModal = () => {
    const {role} = this.props.profile
    const {step} = this.state
    if (role === 'teacher' && step < 5) {
      this.setState({ step: 5 })
    } else {
      this.setState({ open: false })
    }
    this.props.sawRules()
  }

  renderCircle(active) {
    return (
      <div style={{
        marginLeft: 9,
        width: 7,
        height: 7,
        borderRadius: 60,
        background: `rgba(0,0,0,${active ? '0.7' : '0.3'})`
      }}/>
    )
  }

  goForward = () => {
    const {role} = this.props.profile
    const {step} = this.state
    if (role === 'teacher') {
      if (step >= 5) this.handleCloseModal()
    } else {
      if (step >= 4) this.handleCloseModal()
    }
    this.setState({step: step + 1})
  }

  goBack = () => {
    const {step} = this.state
    if (step === 0) return
    this.setState({step: step - 1})
  }

  renderNotificationSettings() {
    return (
      <Modal isOpen={this.state.open} onRequestClose={this.handleCloseModal}>
        <Flex
          column align='center' justify='center'
          style={{maxWidth: Layout.innerWidthPx / 1.7}}
          >
          <Icon2 src='/icons/Icons_ready-27.svg'/>
          <H1 style={{color: Color.lightBlue, textAlign: 'center'}}>
            Benachrichtigungs-einstellungen
          </H1>
          <VSpace v={Padding.l}/>
          <Text style={{paddingLeft: Padding.l, paddingRight: Padding.l}}>
            Hier kannst Du die Benachrichtigungsfunktion einstellen. Wenn Du sie aktiviert hast, bekommst Du eine
            Mitteilung sobald ein Gesprächspartner bereit für eine Unterhal- tung ist. Du kannst die Benachrichtigung
            auch auf Deinem Handy, Tablet und anderen Geräten aktivieren.
          </Text>
          <VSpace v={Padding.m}/>
          <VSpace v={Padding.s}/>
          <Flex align='flex-end' style={{width: '100%'}}>
            <Box auto>
              <NotificationSettingsSmall/>
            </Box>
            <HSpace v={Padding.s}/>
            <Button neg onClick={this.goForward} style={{flex: 1, height: '100%', minWidth: 150}}>
              <H2>Nein, danke.</H2>
            </Button>
          </Flex>
        </Flex>
      </Modal>
    )
  }

  render() {
    if (this.props.profile.sawRules) return null
    const {step} = this.state
    if (step === 5) return this.renderNotificationSettings()
    return (
      <Modal closeIcon={false} isOpen={this.state.open} onRequestClose={this.handleCloseModal}>
        <Flex
          column align='center' justify='center'
          style={{maxWidth: Layout.innerWidthPx / 1.7}}
          >
          <Icon src='/icons/Icons_ready-26.svg'/>
          <H1 style={{color: Color.lightGreen, textAlign: 'center'}}>
            Geschafft!<br/> Willkommen bei Daheim.
          </H1>
          <VSpace v={Padding.l}/>
          <Flex
            column
            style={{paddingLeft: Padding.l, paddingRight: Padding.l}}
            >
            <Text>
              Die Hausregeln zeigen Dir, was auf ‘Daheim’ erlaubt und was nicht erlaubt ist. Wir wollen, dass Du
              Freude an ‘Daheim’ hast und unangenehme Situationen verhindern.
            </Text>
            <VSpace v={Padding.m}/>

            {step === 0 &&
              <div>
                <H2>
                  Alle Formen von Mobbing und Belästigung sind verboten.
                </H2>
                <H2 style={{fontWeight: 'normal'}}>
                  Wir löschen ‘Mitbewohner’ die andere absichtlich beleidigen, herbwürdigen oder beschämen.
                </H2>
              </div>
            }

            {step === 1 &&
              <div>
                <H2>
                  Bedrohungen oder Hassreden sind auf ‘Daheim’ verboten.
                </H2>
                <H2 style={{fontWeight: 'normal'}}>
                  Wir löschen ‘Mitbewohner’, die andere bedrohen, diskriminieren, erniedrigen oder verletzen.
                </H2>
              </div>
            }

            {step === 2 &&
              <div>
                <H2>
                  Auf ‘Daheim’ sind Nacktheit und pornografische Inhalte verboten.
                </H2>
              </div>
            }

            {step === 3 &&
              <div>
                <H2>
                  Auf ‘Daheim’ sind kriminelle Aktivitäten verboten.
                </H2>
                <H2 style={{fontWeight: 'normal'}}>
                  Die Verbreitung von allen kostenpflichtigen Hilfeleistungen, Fragen nach Geld oder das Anbieten von
                  jeglichen Services sind auf ‘Daheim’ verboten. Solltest Du solche Angebote bekommen, dann nimm diese
                  nicht an! Bitte <a href='mailto:hallo@willkommen-daheim.org'>melde</a> uns diese Person sofort.
                </H2>
              </div>
            }

            {step === 4 &&
              <div>
                <H2>
                  Auf ‘Daheim’ sind gewalttätige, gefährliche und illegale Inhalte und Aktivitäten verboten.
                </H2>
              </div>
            }

            <VSpace v={Padding.m}/>

            <Text>
              Bitte <a href='mailto:hallo@willkommen-daheim.org'>melde Dich sofort bei uns</a>, wenn ein
              Gesprächspartner die Hausregeln verletzt oder Du Dich unwohl fühlst.
            </Text>


            <VSpace v={Padding.m}/>
            <Flex justify='center' style={{marginLeft: '-9px'}}>
              {this.renderCircle(step === 0)}
              {this.renderCircle(step === 1)}
              {this.renderCircle(step === 2)}
              {this.renderCircle(step === 3)}
              {this.renderCircle(step === 4)}
            </Flex>
          </Flex>
          <VSpace v={Padding.l}/>
          <Flex>
            <Button onClick={this.goBack}>
              <H2>Zurück</H2>
            </Button>
            <HSpace v={Padding.s}/>
            <Button primary onClick={this.goForward}>
              <H2>Verstanden, weiter</H2>
            </Button>
          </Flex>
        </Flex>
      </Modal>
    )
  }
}

export default connect((state) => {
  const {profile} = state.profile.profile
  return {profile}
}, {sawRules})(WelcomeRaw)