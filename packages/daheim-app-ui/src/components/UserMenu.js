import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import styled from 'styled-components'
import {FormattedMessage} from 'react-intl'

import {Layout, Color, Padding} from '../styles'
import {Flex, H1, H2, VSpace} from './Basic'

const PopupBg = styled.div`
  position: absolute;
  right: ${Padding.s};
  width: ${Layout.headerWidthPx / 2}px;
  margin-top: ${Padding.mPx - 6}px;
  @media (max-width: ${Layout.headerWidthPx / 2 + 4 * Padding.sPx}px) {
    left: ${Padding.s};
    width: auto;
  }
  display: flex;
  flex-direction: column;
  padding: ${Padding.l};
  border-radius: 8px;
  color: white;
  background: ${Color.red};
`

const X = styled.img`
  position: absolute;
  right: ${Padding.m};
  top: ${Padding.m};
  height: 16px;
  object-fit: contain;
  cursor: pointer;
`

class UserItemRaw extends React.Component {
  static propTypes = {
    user: PropTypes.object
  }

  state = {
    open: false
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClick, true)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick, true)
  }

  handleClose = (e) => {
    if (e) e.preventDefault()
    this.setState({ open: false })
  }

  handleOpen = (e) => {
    e.preventDefault()
    const open = this.state.open
    this.setState({
      open: !open,
    })
  }

  handleLinkClick = () => {
    this.setState({
      open: false,
    })
  }

  handleClick = (e) => {
    const container = ReactDOM.findDOMNode(this)
    let target = e.target
    while (target && target !== container) target = target.parentElement
    if (target === container) return
    this.handleClose()
  }

  renderEntry(link, id) {
    return (
      <Link to={link} onClick={this.handleLinkClick}>
        <H1 style={{color: 'white'}}><FormattedMessage id={id}/></H1>
      </Link>
    )
  }

  renderEntrySecondary(link, id) {
    return (
      <a href={link} target='_blank'>
        <H2 style={{color: 'white'}}><FormattedMessage id={id}/></H2>
      </a>
    )
  }

  render () {
    const {open} = this.state
    const {user} = this.props
    const space = Padding.s
    return (
      <div>
        <a href='#' onClick={this.handleOpen}><H2 style={{color: Color.black}}>MENÜ</H2></a>
        {open &&
          <PopupBg>
            <X
              onClick={this.handleClose}
              src='/icons/close.svg'
            />
            {this.renderEntry('/', 'userMenu.frontPage')}
            <VSpace v={space}/>
            {this.renderEntry(`/profile`, 'userMenu.myProfile')}
            <VSpace v={space}/>
            {this.renderEntry('/settings', 'userMenu.settings')}
            <VSpace v={space}/>
            {this.renderEntry('/help', 'userMenu.help')}
            <VSpace v={space}/>
            {this.renderEntry('/auth/logout', 'userMenu.signOut')}
            <VSpace v={Padding.m}/>
            <Flex>
              {this.renderEntrySecondary('https://willkommen-daheim.org/agb/', 'userMenu.agb')}
              <H2>&nbsp;|&nbsp;</H2>
              {this.renderEntrySecondary('https://willkommen-daheim.org/datenschutz/', 'userMenu.privacy')}
              <H2>&nbsp;|&nbsp;</H2>
              {this.renderEntrySecondary('https://willkommen-daheim.org/impressum/', 'userMenu.imprint')}
            </Flex>
            <VSpace v={Padding.m}/>
          </PopupBg>
        }
      </div>
    )
  }
}

export default connect((state, props) => {
  const user = state.profile.profile
  return {user}
}, {})(UserItemRaw)
