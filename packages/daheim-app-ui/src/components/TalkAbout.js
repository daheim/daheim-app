import React from 'react'
import {FormattedMessage} from 'react-intl'

import Weather from './Weather'

export default class TalkAbout extends React.Component {
  render () {
    return (
      <div {...this.props}>
        <h2><FormattedMessage id='talkAbout.whatToTalkAbout' /></h2>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{flex: '0 0 200px', margin: 8}}>
            <h3><FormattedMessage id='talkAbout.alphabet' /></h3>
            <div style={{fontSize: 30, fontFamily: 'monospace'}}>A B C D E<br />F G H I J<br />K L M N O<br />P Q R S T<br />U V W X Y<br />Z Ä Ö Ü ß</div>
          </div>
          <div style={{flex: '1 1 500px', margin: 8}}>
            <h3><FormattedMessage id='talkAbout.weather' /></h3>
            <Weather />
          </div>
          <div style={{flex: '1 1 200px', margin: 8}}>
            <h3><FormattedMessage id='talkAbout.germany' /></h3>
            <div>
              <li><FormattedMessage id='talkAbout.federalStates' /></li>
              <li><FormattedMessage id='talkAbout.capitalCityBerlin' /></li>
            </div>
          </div>
          <div style={{flex: '1 1 200px', margin: 8}}>
            <h3><FormattedMessage id='talkAbout.importantStuff' /></h3>
            <div>
              <li><a href='http://www.fluechtlinge-willkommen.de/' target='_blank'><FormattedMessage id='talkAbout.refugeesWelcome' /></a></li>
            </div>
          </div>
          <div style={{flex: '1 1 200px', margin: 8}}>
            <h3><FormattedMessage id='talkAbout.eatAndDrink' /></h3>
            <div>
              <li><FormattedMessage id='talkAbout.bread' /></li>
              <li><FormattedMessage id='talkAbout.sausage' /></li>
              <li><FormattedMessage id='talkAbout.apple' /></li>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
