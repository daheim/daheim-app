import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {FormattedMessage, injectIntl} from 'react-intl'
import styled from 'styled-components'

import {createTicket} from '../../actions/helpdesk'

import {H1, H2, Button, Flex, Box, VSpace, Text, TextArea} from '../Basic'
import {Layout, Padding, Color} from '../../styles'

const alert = window.alert

const maxWidth = Layout.innerWidthPx / 1.35

const QuestionBox = styled.div`
  padding: 8px;
  border: 2px solid ${Color.lightGreen};
  border-radius: 4px;
  
`

class Question extends Component {
  state = {
    open: false,
  }

  render() {
    const {number, question, children} = this.props
    const open = this.state.open
    return (
      <QuestionBox>
        <Flex align='flex-start' style={{cursor: 'pointer'}} onClick={() => this.setState({open: !open})}>
          <H2 style={{color: Color.lightGreen}}>{number}.</H2>&nbsp;
          <H2>{question}</H2>
          <Box auto/>
          <H2 style={{color: Color.lightGreen}}>▾</H2>
        </Flex>
        {open &&
        <div>
          <VSpace v={Padding.s}/>
          {children}
        </div>
        }
      </QuestionBox>
    )
  }
}

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

  createTicket = async() => {
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

  render() {
    const {push, intl, createTicket, ...otherProps} = this.props // eslint-disable-line no-unused-vars
    const {ticket, getHelpDisabled} = this.state

    return (
      <div>
        <VSpace v={Padding.l}/>
        <Flex justify='center'><H1><FormattedMessage id='help.title'/></H1></Flex>
        <VSpace v={Padding.l}/>

        <H2><FormattedMessage id='help.text1'/></H2>
        <H2 style={{maxWidth: maxWidth}}><FormattedMessage id='help.text2'/></H2>

        <VSpace v={Padding.l}/>

        {this.renderQuestions()}

        <VSpace v={Padding.l}/>

        <H2 style={{maxWidth: maxWidth}}><FormattedMessage id='help.text'/></H2>
        <VSpace v={Padding.m}/>
        <TextArea
          innerRef={this.haveHintRef}
          placeholder={intl.formatMessage({id: 'help.hint'})}
          style={{maxWidth: Layout.innerWidthPx / 1.7, borderColor: Color.lightGreen}}
          value={ticket}
          onChange={this.handleTicketChange}
        />
        <VSpace v={Padding.s}/>
        <Button
          primary
          disabled={getHelpDisabled}
          label={intl.formatMessage({id: 'help.submit'})}
          onClick={this.createTicket}
          >
          <H2><FormattedMessage id='help.submit'/></H2>
        </Button>

        <VSpace v={Padding.m}/>

        <H2 style={{maxWidth: maxWidth}}><FormattedMessage id='help.effort'/></H2>
      </div>
    )
  }

  renderQuestions() {
    return (
      <div>
        <Question number={1} question='Why is ‚Daheim‘ only in German?'>
          <Text>
            ‘Daheim’ is an online video telephony software service for mobile learning. It helps to improve German
            language skills as well as intercultural exchange in an uncomplicated and inclusive way. Using an
            intelligent interest-based matching algorithm, non-native speakers who want to learn German get in touch
            with committed native speakers – mobile, timely flexible and free of charge.
          </Text>
          <VSpace v={Padding.s}/>
          <Text>
            Since one of our main goals is to practice German language skills, ‘Daheim’ is in German only. This is not
            to offend people with little German skills but has a simple reason: ‘Daheim’s goal is to connect native
            German speakers with non-native speakers. To be able to have a somewhat fluent German conversation, it is
            inevitable that you have (at least) a small vocabulary in German. Otherwise conversations are, for both
            conversation partners, rather frustrating. That is why we see ‘Daheim’ as a little pre-test of your language
            skills.<br/>
            Feel like practicing a bit more? Here, you find a list with learning material.
          </Text>
          <VSpace v={Padding.s}/>
          <Text>
            Was it too difficult to understand the German on the rest of our website?
          </Text>
          <VSpace v={Padding.s}/>
          <Text>
            <a href='#'>Here</a> we explain how our platform works by using less complicated German phrases.
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question number={2} question="Wann geht's los?">
          <Text>
            ‚Daheim‘ ist jetzt online. Je mehr Menschen gleichzeitig online sind, desto höher ist die
            Chance, dass viele nette Gespräche entstehen können. Solltest Du einmal auf ‚Daheim‘ kommen
            und kein Gesprächspartner ist online, dann schau Dir gerne in der Zwischenzeit unsere Tipps zum &nbsp;
            <a href="https://willkommen-daheim.org/hilfe#Deutsch-lernen">Deutsch lernen</a> oder &nbsp;
            <a href="https://willkommen-daheim.org/hilfe#Deutsch-vermitteln">Deutsch vermitteln</a> an.
          </Text>
          <VSpace v={Padding.s}/>
          <Text>
            Alle weiteren wichtigen Infos geben wir über unseren Newsletter bekannt. &nbsp;
            <a href="https://daheimapp.de/newsletter/">Hier</a> kannst Du Dich dafür anmelden.
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question number={3} question="Auf welchen Devices kann ich ‚Daheim‘ nutzen?">
          <Text>
            ‚Daheim‘ kann sowohl auf dem Computer als auch auf dem Smartphone genutzt werden. Derzeit funktioniert die
            Plattform leider nur auf Android-Geräten, wir versuchen aber ‚Daheim‘ schnellstmöglich auch für iPhones und
            iPads zur Verfügung zu stellen!
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question number={4} question="Gibt es ‚Daheim‘ auch als App?">
          <Text>
            ‚Daheim‘ gibt es noch nicht als App. Aber wir arbeiten daran und informieren Dich sobald es soweit ist über
            unseren <a href="http://daheimapp.de/newsletter">Newsletter</a>.
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question number={5} question="Wie melde ich mich an?">
          <Text>
            Um Dich für ‚Daheim‘ anzumelden, klicke oben rechts auf der Startseite auf „Registrieren“. Daraufhin gibst
            Du Deine E-Mail-Adresse an und denkst Dir ein Passwort aus. Auf der nächsten Seite gibst Du Deinen Namen an,
            ob Du Muttersprachler bist oder Deutsch lernen möchtest sowie Deine Interessen und wählst ein Profilbild
            aus. Wenn Du bereit für ein Gespräch bist, klicke auf „Los geht’s!“. Sobald ein passender Gesprächspartner
            online ist, kannst Du ein Gespräch starten. <a href="http://bit.ly/2fLd105" target="_blank">Hier</a> gibt es
            Erklärungen für Smartphone und Laptops in leichter Sprache – von der Registrierung bis zum Gespräch.
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question number={6} question="Bei mir funktioniert ‘Daheim‘ nicht. Woran kann das liegen?">
          <Text>
            Vielleicht liegt es an Deinem Browser: Solltest du gerade nicht über Firefox oder Chrome im Internet sein,
            probier es über diese Browser noch einmal! Auf iPhones funktioniert ‚Daheim‘ leider noch nicht. Falls Du es
            damit probiert hast, versuch es mal über deinen Computer oder ein Android-Gerät. Schlechte/s
            Internetverbindung/WLAN kann leider auch ein Grund sein, warum ‚Daheim‘ nicht funktionieren kann&#8230;
            Überprüfe zur Sicherheit einmal Deine Internetverbindung!
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question number={7} question="Kostet ‚Daheim‘ etwas?">
          <Text>
            Nein. Daheim ist und bleibt kostenlos!
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question number={8} question="Wie kann ich kostenlos mein aktuelles Sprachniveau testen?">
          <Text>
            Unter diesem Link kannst Du Deine Deutschkenntnisse testen. Für registrierte Flüchtlinge ist dies kostenlos:
            <br/>
            <a href="https://refugees.onset.de/" target="_blank">https://refugees.onset.de/</a>
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question
          number={9}
          question="Was mache ich, wenn mich mein Gesprächspartner schlecht behandelt, mich zum Beispiel beleidigt?"
          >
          <Text>
            Respektvolles Verhalten gegenüber dem jeweiligen Gesprächspartner gehört zu unseren Grundsätzen bei ‚Daheim‘
            und das haben wir auch in unserer Netiquette festgehalten. Sollte jemand dennoch dagegen verstoßen, kannst
            Du Deinen Gesprächspartner nach dem Gespräch bei uns melden, in dem Du auf den Button „Melden“ klickst. Dann
            setzen wir uns mit ihm in Verbindung und sperren ggf. seinen Account. Wir versuchen alle Verstöße
            schnellstmöglich aufzuklären. In jedem Fall solltest Du derartige Kontakte für zukünftige Kontaktaufnahmen
            blockieren.
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question number={10} question="Darf ich während der Gespräche ein Lexikon verwenden?">
          <Text>
            Natürlich! Alles, was das Gespräch vereinfacht und veranschaulicht, darfst Du sehr gerne benutzen. Nützlich
            können hierbei auch Bilder und Zeichnungen sein. Weitere Tipps findest Du bald hier auf unserem Blog.
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question
          number={11}
          question="Ich würde gerne noch mehr die deutsche Sprache üben. Wo finde ich Online-Lernmaterial?"
          >
          <Text>
            Hier gibt es interaktive Übungen, Videos zum Herunterladen und vieles anderes:
            <br/>
            <a href="http://dw.com/p/1HCBz" target="_blank">Übungen zum Deutsch lernen</a>
            <br/><br/>
            Zu schwer? Finde hier den richtigen Kurs für dein Sprachniveau:
            <br/>
            <a href="http://www.dw.com/de/deutsch-lernen/kursfinder/s-13211" target="_blank">Finde den richtigen Kurs</a>
            <br/><br/>
            Zu einfach? Hier gibt es Videos mit schwierigeren Inhalten, in denen Du viel über Deutschland lernen kannst:
            <br/>
            <a href="http://www.dw.com/de/deutsch-lernen/video-thema/s-12165" target="_blank">Übungen &#8211; Sprachniveau B2</a>
            <br/><br/>
            Immer noch zu einfach? Hier gibt es Materialien auf C-Niveau (also dem höchsten Sprachniveau):
            <br/>
            <a href="http://www.dw.com/de/deutsch-lernen/lernangebote-f%C3%BCr-das-niveau-c/s-13218" target="_blank">Übungen &#8211; Sprachniveau C1 und C2</a>
            <br/><br/>
            Guckst du gern Fernsehen? Dann ist die Telenovela von der Deutschen Welle für Deutschlerner vielleicht genau das Richtige für Dich:
            <br/>
            <a href="http://www.dw.com/de/deutsch-lernen/telenovela/s-13121" target="_blank">Deutsch lernen mit Jojo &#8211; Telenovela</a>
            <br/><br/>
            Auf der Facebook-Seite der Deutschen Welle gibt es noch viel mehr Angebote, Du kannst Fragen stellen und Aufgaben lösen:
            <br/>
            <a href="https://www.facebook.com/dw.learngerman" target="_blank">Deutsche Welle auf Facebook</a>
            <br/><br/>
            Natürlich gibt es auch auf Youtube unheimlich viel, hier ein paar Vorschläge:
            <br/>
            <a href="https://www.youtube.com/watch?v=iyoptTjDtz0&amp;list=PLVGpRPj4XyK4WkiMyPS0TS4Tzi7gOTOGS" target="_blank">Easy German &#8211; Jobs and careers</a>
            <br/>
            <a href="https://www.youtube.com/watch?v=0NG4eEcJLj0" target="_blank">Deutsch lernen: Grundwortschatz</a>
            <br/>
            <a href="https://www.youtube.com/watch?v=ixObmWO8qRc&amp;list=PLabBletKBo0O2RkWR9FrVfCgk2_u8Ove_" target="_blank">Flüchtlinge Willkommen: Impressionen aus den WGs</a>
          </Text>
        </Question>

        <VSpace v={Padding.s}/>

        <Question
          number={12}
          question="Wo finde ich Tipps, wie ich die deutsche Sprache und Kultur vermitteln kann?"
          >
          <Text>
            Es gibt online viele Ratgeber zum Unterrichten der deutschen Sprache. Diese sind häufig für den
            Offline-Unterricht in Deutschkursen gedacht, lassen sich aber auch gut auf Online-Gespräche übertragen!
          </Text>
        </Question>
      </div>
    )
  }
}

export default injectIntl(connect(null, {push, createTicket})(HelpPage))
