import React from 'react'
import {Link} from 'react-router'

import Logo from './Logo'
import UserMenu from './UserMenu'
import style from './Header.style'

export default class Header extends React.Component {
  render () {
    return (
      <div>
        <div className={style.head2}>
          <div className={style.topbar}>
            <div className={style.logo}>
              <Link to='/'><Logo /></Link>
            </div>
            <div className={style.spacer}></div>
            <div className={style.profile}>
              <UserMenu />
            </div>
          </div>
        </div>
        <div className={style.topbarSpacing}></div>
        <div className={style.cover2}>
          <div className={style.photo}></div>
          <div className={style.title}>Presse</div>
        </div>
      </div>
    )
  }
}
