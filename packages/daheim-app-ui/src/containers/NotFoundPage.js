import React from 'react'
import {goBack} from 'react-router-redux'
import {connect} from 'react-redux'
import styled from 'styled-components'

import {Flex, Button, Text, H2, H1, VSpace} from '../components/Basic'
import {Layout, Color, Padding} from '../styles'

const Icon = styled.img`
  height: 50px;
  object-fit: contain;
`

class NotFoundPage extends React.Component {

  static propTypes = {
    goBack: React.PropTypes.func.isRequired
  }

  goBack = (e) => {
    e.preventDefault()
    this.props.goBack()
  }

  render () {
    return (
      <Flex
        column align='center' justify='center'
        style={{maxWidth: Layout.innerWidthPx / 1.7, paddingLeft: Padding.m, paddingRight: Padding.m}}
        >
        <Icon src='/icons/Icons_ready-25.svg'/>
        <H1 style={{color: Color.red, textAlign: 'center'}}>
          Uups! Die Seite gibt es nicht.
        </H1>
        <VSpace v={Padding.m}/>
        <Text style={{width: '100%', paddingLeft: Padding.m, paddingRight: Padding.m}}>
          Leider konnte diese Seite nicht gefunden werden.
        </Text>
        <VSpace v={Padding.l}/>
        <Button primary onClick={this.goBack}>
          <H2>Zurück</H2>
        </Button>
      </Flex>
    )
  }

}

export default connect(null, {goBack})(NotFoundPage)
