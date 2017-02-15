import React from 'react'
import {FormattedMessage} from 'react-intl'
import styled from 'styled-components'

import {H2, H3, Flex, VSpace, Text} from './Basic'
import {Layout, Padding} from '../styles'

const Image = styled.img`
  height: 240px;
  object-fit: contain;
`

const rowSpacing = Padding.l
const colSpacing = Padding.l

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: -${rowSpacing};
  margin-right: -${colSpacing};
  @media (max-width: ${Layout.mobileBreakpoint}) {
    justify-content: center;
  }
`

export default class TalkAbout extends React.Component {
  renderEntry(image, title, body) {
    return (
      <Flex
        column align='center' justify='start'
        style={{width: Layout.widthPx / 3.9, marginBottom: rowSpacing, marginRight: colSpacing}}
        >
        <H3>{title}</H3>
        <VSpace v={Padding.s}/>
        <Image src={`/talk/Gesprächsseite_Icons-${image}.svg`}/>
        <VSpace v={Padding.s}/>
        <div style={{width: '100%'}}>
          {body}
        </div>
      </Flex>
    )
  }

  render () {
    return (
      <div style={{width: '100%'}}>
        <H2><FormattedMessage id='ready.talk.about'/></H2>
        <VSpace v={Padding.m}/>
        <Container>
          {this.renderEntry('01', 'Dein Tag',<Text>
            Wie geht es Dir?<br/>
            Was machst Du heute?<br/>
            Was machst Du heute Abend?
          </Text>)}

          {this.renderEntry('02', 'Deutschland',<Text>
            Wie gefällt Dir Deutschland?<br/>
            Was ist neu für Dich?<br/>
            Was ist anders?<br/>
            Aktuelle Themen
          </Text>)}
          {this.renderEntry('05', 'Alltag',<Text>
            Im Bus<br/>
            Beim Bäcker<br/>
            Im Supermarkt<br/>
            Beim Arzt
          </Text>)}
          {this.renderEntry('06', 'Sprich doch über',<Text>
            Was isst Du gerne?<br/>
            Kochst Du gerne?<br/>
            Welches Essen ist neu für Dich?<br/>
            Welches Essen fehlt Dir?<br/>
            Was isst Du heute Abend?
          </Text>)}
          {this.renderEntry('04', 'Fest und Feiertage',<Text>
            Geburtstag<br/>
            Namenstag<br/>
            Weihnachten<br/>
            Ramadan<br/>
            Ostern<br/>
            Chanukka<br/>
            Andere Feiertage?
          </Text>)}
          {this.renderEntry('03', 'Essen und Trinken',<Text>
            Deine Schule<br/>
            Deine Freunde<br/>
            Deinen Beruf<br/>
            Deine Kultur
          </Text>)}
        </Container>
      </div>
    )
  }
}
