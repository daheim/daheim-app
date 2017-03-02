import React from 'react'
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl'
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
  renderEntry(image, titleId, bodyId) {
    return (
      <Flex
        column align='center' justify='start'
        style={{width: Layout.widthPx / 3.9, marginBottom: rowSpacing, marginRight: colSpacing}}
        >
        <H3><FormattedMessage id={titleId}/></H3>
        <VSpace v={Padding.s}/>
        <Image src={`/talk/Gesprächsseite_Icons-${image}.svg`}/>
        <VSpace v={Padding.s}/>
        <div style={{width: '100%'}}>
          <Text><FormattedHTMLMessage id={bodyId}/></Text>
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
          {this.renderEntry('01', 'ready.talk.yourday.title', 'ready.talk.yourday.body')}
          {this.renderEntry('02', 'ready.talk.germany.title', 'ready.talk.germany.body')}
          {this.renderEntry('05', 'ready.talk.everyday.title', 'ready.talk.everyday.body')}
          {this.renderEntry('06', 'ready.talk.food.title', 'ready.talk.food.body')}
          {this.renderEntry('04', 'ready.talk.holidays.title', 'ready.talk.holidays.body')}
          {this.renderEntry('03', 'ready.talk.whynot.title', 'ready.talk.whynot.body')}
        </Container>
      </div>
    )
  }
}
