import './bootstrap'

import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import {IntlProvider, addLocaleData} from 'react-intl'
import localeDe from 'react-intl/locale-data/de'
import messagesDe from './intl/de'
import messagesEn from './intl/en'
import {injectGlobal} from 'styled-components'

import createRouter from './router'
import muiTheme from './theme'
import createStore from './store'
import api from './api_client'
import reporter from './reporter'
import {hydrateNotYetOpen} from './actions/not_yet_open'
import {startServiceWorker} from './middlewares/service_worker'

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
// const messages = messagesEn

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
  const store = createStore(browserHistory, api, window.__data)
  const history = syncHistoryWithStore(withScroll(browserHistory), store)

  injectTapEventPlugin()
  reporter.watchStore(store)
  store.dispatch(hydrateNotYetOpen())
  store.dispatch(startServiceWorker())

  const dest = document.getElementById('content')
  ReactDOM.render(<App store={store} history={history} />, dest)
}

if (!global.Intl) {
  require.ensure([], function (require) {
    require('intl')
    require('intl/locale-data/jsonp/en.js')
    require('intl/locale-data/jsonp/de.js')
    main()
  }, 'intl-polyfill')
} else {
  main()
}

/* https://projects.lukehaas.me/css-loaders/ */
injectGlobal`
.loader {
  font-size: 18px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  -webkit-animation: load5 1.1s infinite ease;
  animation: load5 1.1s infinite ease;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  filter: brightness(0);
}
@keyframes load5 {
  0%,
  100% {
    box-shadow: 0 -2.6em 0 0 #ffffff, 1.8em -1.8em 0 0 rgba(255, 255, 255, 0.2), 2.5em 0 0 0 rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0 rgba(255, 255, 255, 0.2), 0 2.5em 0 0 rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0 rgba(255, 255, 255, 0.2), -2.6em 0 0 0 rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0 rgba(255, 255, 255, 0.7);
  }
  12.5% {
    box-shadow: 0 -2.6em 0 0 rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0 #ffffff, 2.5em 0 0 0 rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0 rgba(255, 255, 255, 0.2), 0 2.5em 0 0 rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0 rgba(255, 255, 255, 0.2), -2.6em 0 0 0 rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0 rgba(255, 255, 255, 0.5);
  }
  25% {
    box-shadow: 0 -2.6em 0 0 rgba(255, 255, 255, 0.5), 1.8em -1.8em 0 0 rgba(255, 255, 255, 0.7), 2.5em 0 0 0 #ffffff, 1.75em 1.75em 0 0 rgba(255, 255, 255, 0.2), 0 2.5em 0 0 rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0 rgba(255, 255, 255, 0.2), -2.6em 0 0 0 rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0 rgba(255, 255, 255, 0.2);
  }
  37.5% {
    box-shadow: 0 -2.6em 0 0 rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0 rgba(255, 255, 255, 0.5), 2.5em 0 0 0 rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0 #ffffff, 0 2.5em 0 0 rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0 rgba(255, 255, 255, 0.2), -2.6em 0 0 0 rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 0 -2.6em 0 0 rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0 rgba(255, 255, 255, 0.2), 2.5em 0 0 0 rgba(255, 255, 255, 0.5), 1.75em 1.75em 0 0 rgba(255, 255, 255, 0.7), 0 2.5em 0 0 #ffffff, -1.8em 1.8em 0 0 rgba(255, 255, 255, 0.2), -2.6em 0 0 0 rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0 rgba(255, 255, 255, 0.2);
  }
  62.5% {
    box-shadow: 0 -2.6em 0 0 rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0 rgba(255, 255, 255, 0.2), 2.5em 0 0 0 rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0 rgba(255, 255, 255, 0.5), 0 2.5em 0 0 rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0 #ffffff, -2.6em 0 0 0 rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0 rgba(255, 255, 255, 0.2);
  }
  75% {
    box-shadow: 0 -2.6em 0 0 rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0 rgba(255, 255, 255, 0.2), 2.5em 0 0 0 rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0 rgba(255, 255, 255, 0.2), 0 2.5em 0 0 rgba(255, 255, 255, 0.5), -1.8em 1.8em 0 0 rgba(255, 255, 255, 0.7), -2.6em 0 0 0 #ffffff, -1.8em -1.8em 0 0 rgba(255, 255, 255, 0.2);
  }
  87.5% {
    box-shadow: 0 -2.6em 0 0 rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0 rgba(255, 255, 255, 0.2), 2.5em 0 0 0 rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0 rgba(255, 255, 255, 0.2), 0 2.5em 0 0 rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0 rgba(255, 255, 255, 0.5), -2.6em 0 0 0 rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0 #ffffff;
  }
}
`