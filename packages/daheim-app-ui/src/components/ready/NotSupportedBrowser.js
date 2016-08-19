import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

class NotSupportedBrowser extends Component {

  static FIREFOX_URL = 'https://firefox.com'
  static CHROME_URL = 'https://www.google.com/chrome/'
  static MIN_CHROME_VERSION = 50
  static MIN_FIREFOX_VERSION = 45

  static getBrowserUpgradeInfo (browser) {
    const version = parseFloat(browser.version)
    if (browser.chrome) {
      if (version >= NotSupportedBrowser.MIN_CHROME_VERSION) return {ok: true}
      return {chrome: true}
    } else if (browser.firefox) {
      if (version >= NotSupportedBrowser.MIN_FIREFOX_VERSION) return {ok: true}
      return {firefox: true}
    } else {
      return {generic: true}
    }
  }

  static propTypes = {
    browser: PropTypes.object.isRequired
  }

  render () {
    const {browser} = this.props
    const updateInfo = NotSupportedBrowser.getBrowserUpgradeInfo(browser)
    if (updateInfo.ok) return null

    return (
      <div style={{padding: 16, border: 'solid 1px darkred', background: '#F88379', marginBottom: 16, fontFamily: 'Lato, sans-serif', borderRadius: 6}}>
        {updateInfo.generic ? (
          <div style={{textAlign: 'center'}}>
            <div style={{marginBottom: 24}}><FormattedMessage id='browserNotSupported' /></div>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{padding: '0 24px'}}><a href={NotSupportedBrowser.FIREFOX_URL} target='_blank'><img src='https://assets.daheimapp.de/media/firefox_logo.png' style={{width: 96, height: 96}} /></a></div>
              <div style={{padding: '0 24px'}}><a href={NotSupportedBrowser.CHROME_URL} target='_blank'><img src='https://assets.daheimapp.de/media/chrome_logo.svg' style={{width: 96, height: 96}} /></a></div>
            </div>
          </div>
        ) : (
          <div style={{textAlign: 'center'}}>
            <div style={{marginBottom: 24}}><FormattedMessage id='browserTooOld' values={{browserName: browser.name}} /></div>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
              {browser.chrome ? (
                <div><a href={NotSupportedBrowser.CHROME_URL} target='_blank'><img src='https://assets.daheimapp.de/media/chrome_logo.svg' style={{width: 96, height: 96}} /></a></div>
              ) : (
                <div><a href={NotSupportedBrowser.FIREFOX_URL} target='_blank'><img src='https://assets.daheimapp.de/media/firefox_logo.png' style={{width: 96, height: 96}} /></a></div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

}

export default connect((state) => {
  const {browser} = state
  return {browser}
})(NotSupportedBrowser)
