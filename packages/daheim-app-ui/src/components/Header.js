import React from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Link} from 'react-router'
import styled from 'styled-components'

import UserMenu from './UserMenu'
import {Layout, Color, Padding} from '../styles'
import {Box, Flex, H2, HSpace, Avatar} from './Basic'

const BgArea = styled.div`
  position: fixed;
  z-index: 999;
  margin-top: -${Layout.topbarHeight};
  width: 100%;
  background: white;
  height: ${Layout.topbarHeight};
`

const MainArea = styled.div`
  position: relative;
  maxWidth: ${Layout.headerWidth};
  height: 100%;
  margin: 0 auto;
  padding: 0 ${Padding.s};
  display: flex;
  align-items: center;
`

const Logo = styled.img`
  display: none;
  height: 25px;
  object-fit: contain;
`

const LogoDesktop = styled(Logo)`
  margin-left: -3px;
  @media (min-width: ${Layout.mobileBreakpoint}) {
    display: block;
  }
`

const LogoMobile = styled(Logo)`
  @media (max-width: ${Layout.mobileBreakpointPx-1}px) {
    display: block;
  }
`

const HiddenOnMobile = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: ${Layout.mobileBreakpoint}) {
    display: none;
  }
`

class Header extends React.Component {
  render () {
    return (
      <BgArea>
        <MainArea>
          <Link to='/'>
            <LogoMobile src='/daheim-logo_3.svg'/>
            <LogoDesktop src='/daheim-logo_2.svg'/>
          </Link>
          <Box auto/>
          <HiddenOnMobile>
            <ProfileNamePic
              user={this.props.user}
              onClick={() => this.props.push(`users/${this.props.user.id}`)}
            />
            <HSpace v={Padding.m}/>
            <Link to='/'>
              <Flex align='center'>
                <img style={{height: '20px', marginBottom: '5px'}} src='/icons/Icons_ready-32.svg'/>
                <HSpace v='3px'/>
                <H2 style={{color: Color.black}}>START</H2>
              </Flex>
            </Link>
            <HSpace v={Padding.m}/>
          </HiddenOnMobile>
          <UserMenu/>
        </MainArea>
      </BgArea>
    )
  }
}

class ProfileNamePic extends React.Component {
  render () {
    const {onClick, user: {profile: {name, picture} = {}} = {}} = this.props
    return (
      <Flex align='center' onClick={onClick} style={{cursor: 'pointer'}}>
        <H2>{name}</H2>
        <HSpace v='12px'/>
        <Avatar size='32px' src={picture} />
      </Flex>
    )
  }
}

export default connect((state, props) => {
  const user = state.profile.profile
  return {user}
}, {push})(Header)