import React from 'react'

import Weather from './Weather'

export default class TalkAbout extends React.Component {
  render () {
    return (
      <div {...this.props}>
        <h2>Über was kann man reden?</h2>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{flex: '0 0 200px', margin: 8}}>
            <h3>...das Alphabet</h3>
            <div style={{fontSize: 30, fontFamily: 'monospace'}}>A B C D E<br />F G H I J<br />K L M N O<br />P Q R S T<br />U V W X Y<br />Z Ä Ö Ü ß</div>
          </div>
          <div style={{flex: '1 1 500px', margin: 8}}>
            <h3>...das Wetter</h3>
            <Weather />
          </div>
          <div style={{flex: '1 1 200px', margin: 8}}>
            <h3>...Deutschland</h3>
            <div>
              <li>die Bundesländer</li>
              <li>Hauptstadt Berlin</li>
            </div>
          </div>
          <div style={{flex: '1 1 200px', margin: 8}}>
            <h3>...wichtige Dinge</h3>
            <div>
              <li><a href='http://www.fluechtlinge-willkommen.de/' target='_blank'>Flüchtlinge Willkommen</a></li>
            </div>
          </div>
          <div style={{flex: '1 1 200px', margin: 8}}>
            <h3>...Essen und Trinken</h3>
            <div>
              <li>Brot</li>
              <li>Wurst</li>
              <li>Apfel</li>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
