import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover'
import classnames from 'classnames'
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down'
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up'
import {FormattedMessage} from 'react-intl'

import style from './Header.style'

class UserDropdown extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func
  }

  handleClick = (e) => {
    if (this.props.onRequestClose) this.props.onRequestClose()
  }

  render () {
    const {user} = this.props

    return (
      <div style={{width: 200, overflowY: 'auto'}}>
        <Link to='/' className={style.dropDownItem} onClick={this.handleClick}><FormattedMessage id='userMenu.frontPage' /></Link>
        <Link to={`/users/${user.id}`} className={style.dropDownItem} onClick={this.handleClick}><FormattedMessage id='userMenu.myProfile' /></Link>
        <Link to='/password' className={style.dropDownItem} onClick={this.handleClick}><FormattedMessage id='userMenu.settings' /></Link>
        <Link to='/auth/logout' className={style.dropDownItem} onClick={this.handleClick}><FormattedMessage id='userMenu.signOut' /></Link>
      </div>
    )
  }
}

class UserItemRaw extends React.Component {
  static propTypes = {
    user: PropTypes.object
  }

  state = {
    open: false
  }

  handleRequestClose = (e) => {
    this.setState({ open: false })
  }

  handleClick = (e) => {
    e.preventDefault()
    this.setState({
      open: true,
      anchorEl: e.currentTarget
    })
  }

  render () {
    const {open} = this.state
    const {user: {profile: {name, picture} = {}} = {}} = this.props
    const classes = classnames({
      [style.headerItem]: true,
      [style.headerItemActive]: open
    })
    return (
      <div>
        <Link to='/profile' className={classes} onClick={this.handleClick}>
          <div style={{ marginRight: 12 }}>
            {name}
          </div>
          <img className={style.avatar} src={picture} />
          {open ? <ArrowDropUp style={{height: 24}} /> : <ArrowDropDown style={{height: 24}} />}
        </Link>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
          style={{ borderRadius: null }}
        >
          <UserDropdown
            {...this.props}
            onRequestClose={this.handleRequestClose} />
        </Popover>
      </div>
    )
  }
}

export default connect((state, props) => {
  const user = state.profile.profile
  return {user}
}, {})(UserItemRaw)
