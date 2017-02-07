import React from 'react'
import {Link} from 'react-router'
import styled from 'styled-components'

import Logo from './Logo'
import UserMenu from './UserMenu'
import {Layout} from '../styles'
import {Box} from './Basic'

const BgArea = styled.div`
  position: fixed;
  z-index: 999;
  margin-top: -${Layout.topbarHeight};
  width: 100%;
  background: white;
  height: ${Layout.topbarHeight};
`

const MainArea = styled.div`
  maxWidth: ${Layout.width};
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
`

export default class Header extends React.Component {
  render () {
    return (
      <BgArea>
        <MainArea>
          <Link to='/'><Logo/></Link>
          <Box auto/>
          <UserMenu/>
        </MainArea>
      </BgArea>
    )
  }
}