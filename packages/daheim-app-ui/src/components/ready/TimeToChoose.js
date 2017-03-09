import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import styled from 'styled-components'

import {switchRole} from '../../actions/profile'
import {connect as liveConnect} from '../../actions/live'
import {Layout, Padding} from '../../styles'
import {Button, H1, H2, Flex, VSpace} from '../Basic'

const Container = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: ${Layout.mobileBreakpoint}) {
    flex-direction: column;
    align-items: center;
  }
`

class TimeToChoose extends Component {
  static propTypes = {
    switchRole: PropTypes.func.isRequired,
    liveConnect: PropTypes.func.isRequired,
    profile: PropTypes.object,
    onFinished: PropTypes.func,
  }

  student = async () => {
    await this.props.switchRole('student')
    this.props.liveConnect()
    if (this.props.onFinished) this.props.onFinished()
  }

  teacher = async () => {
    await this.props.switchRole('teacher')
    this.props.liveConnect()
    if (this.props.onFinished) this.props.onFinished()
  }

  renderOption = (primary, id1, id2, onClick) => {
    return (
      <Flex column align='center' style={{width: `${Layout.innerWidthPx / 2.2}px`}}>
        <Button primary={primary} neg={!primary} style={{width: '100%', paddingTop: 8, paddingBottom: 8}} onClick={onClick}>
          <H1><FormattedMessage id={id1}/></H1>
        </Button>
        <VSpace v={Padding.m}/>
        <H2 style={{textAlign: 'center', width: '80%'}}>
          <FormattedMessage id={id2}/>
        </H2>
      </Flex>
    )
  }

  render () {
    if (!this.props.profile) return null
    return (
      <Container>
        {this.renderOption(true, 'editProfile.student', 'editProfile.studentExplanation', this.student)}
        <div style={{marginBottom: Padding.m, marginRight: Padding.m}}/>
        {this.renderOption(false, 'editProfile.teacher', 'editProfile.teacherExplanation', this.teacher)}
      </Container>
    )
  }
}

export default connect((state, props) => {
  const {profile} = state.profile
  return {profile}
}, {switchRole, liveConnect})(TimeToChoose)
