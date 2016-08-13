import './bootstrap'

import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import {IntlProvider, addLocaleData} from 'react-intl'
import localeDe from 'react-intl/locale-data/de'
import messagesDe from './intl/de'
import messagesEn from './intl/en'
import Modal from 'react-modal'

import createRouter from './router'
import muiTheme from './theme'
import createStore from './store'
import api from './api_client'
import reporter from './reporter'
import {hydrateNotYetOpen} from './actions/not_yet_open'

import './default.css'
import './effects.css'
import './dhm_profile_camera.css'

import { browserHistory } from 'react-router'
import withScroll from 'scroll-behavior'
import { syncHistoryWithStore } from 'react-router-redux'

import moment from 'moment'

moment.locale('de') // TODO: find a better place to init
addLocaleData(localeDe) // TODO: find a better place to init Intl
const messages = {...messagesEn, ...messagesDe}
//const messages = messagesEn

function setupModalStyle () {
  Modal.defaultStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      zIndex: 2
    },
    content : {
      position: 'absolute',
      top: '40px',
      left: '40px',
      right: '40px',
      bottom: '40px',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px'
    }
  }
}

class App extends React.Component {

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  }

  static propTypes = {
    history: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
  }

  getChildContext () {
    return { muiTheme }
  }

  router = createRouter(this.props.history)

  render () {
    return (
      <Provider store={this.props.store}>
        <IntlProvider locale='de' messages={messages}>
          {this.router}
        </IntlProvider>
      </Provider>
    )
  }
}

function main () {
  setupModalStyle()

  const store = createStore(browserHistory, api, window.__data)
  const history = syncHistoryWithStore(withScroll(browserHistory), store)

  injectTapEventPlugin()
  reporter.watchStore(store)
  store.dispatch(hydrateNotYetOpen())

  const dest = document.getElementById('content')
  ReactDOM.render(<App store={store} history={history} />, dest)
}

main()
