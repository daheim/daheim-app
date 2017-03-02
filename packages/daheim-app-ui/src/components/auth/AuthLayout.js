import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {Padding, Fontsize, Color} from '../../styles'
import {VSpace} from '../Basic'

export default class AuthLayout extends Component {

  static propTypes = {
    children: PropTypes.node
  }

  render () {
    return (
      <div style={{paddingTop: 100, textAlign: 'center'}}>

        <div style={{background: '#222', backgroundSize: 'cover', backgroundImage: 'url(/login_bg.jpg)', position: 'fixed', top: 0, right: 0, bottom: 0, left: 0}} />

        <div style={{
          background: 'rgba(255,255,255,1)',
          border: `2px solid ${Color.lightGreen}`,
          borderRadius: 10,
          padding: '15px',
          position: 'relative',
          margin: '0 auto',
          display: 'inline-block',
          textAlign: 'start',
          }}>
          <div style={{textAlign: 'center'}}>
            <Link to='/'>
              <img src='/daheim-logo_1.svg' style={{height: Padding.xl}} />
            </Link>
          </div>
          <VSpace v={Padding.m}/>
          {this.props.children}
        </div>

        <div style={{
          textAlign: 'center',
          paddingTop: 6,
          color: 'rgba(255, 255, 255, 1)',
          fontSize: Fontsize.m, position: 'relative',
          fontWeight: 'bold',
          fontFamily: 'Rambla',
          }}>
          <span style={{padding: '0 10px'}}><a style={{color: 'rgba(255, 255, 255, 1)'}} href='https://daheimapp.de'>Startseite</a></span> |
          <span style={{padding: '0 10px'}}><a style={{color: 'rgba(255, 255, 255, 1)'}} href='https://daheimapp.de/impressum/' target='_blank'>Impressum</a></span> |
          <span style={{padding: '0 10px'}}><a style={{color: 'rgba(255, 255, 255, 1)'}} href='https://daheimapp.de/agb/' target='_blank'>AGB</a></span> |
          <span style={{padding: '0 10px'}}><a style={{color: 'rgba(255, 255, 255, 1)'}} href='https://daheimapp.de/privacy/' target='_blank'>Datenschutz</a></span>
        </div>

      </div>
    )
  }

}
