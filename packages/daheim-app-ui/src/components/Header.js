import React from 'react'
import {connect} from 'react-redux'
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
  display: flex;
  align-items: center;
`

class Header extends React.Component {
  render () {
    return (
      <BgArea>
        <MainArea>
          <Link to='/'>
            <img style={{width: '250px', marginLeft: '-3px'}} src='/daheim-logo_2.svg'/>
          </Link>
          <Box auto/>
          <ProfileNamePic user={this.props.user}/>
          <HSpace v={Padding.m}/>
          <Link to='/'>
            <Flex align='center'>
              <img style={{height: '20px', marginBottom: '5px'}} src='/icons/Icons_ready-32.svg'/>
              <HSpace v='3px'/>
              <H2 style={{color: Color.black}}>START</H2>
            </Flex>
          </Link>
          <HSpace v={Padding.m}/>
          <UserMenu/>
        </MainArea>
      </BgArea>
    )
  }
}

class ProfileNamePic extends React.Component {
  render () {
    const {user: {profile: {name, picture} = {}} = {}} = this.props
    return (
      <Flex align='center'>
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
}, {})(Header)