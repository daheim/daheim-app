import IntlMessageFormat from 'intl-messageformat'
import memoizeFormatConstructor from 'intl-format-cache'

import log from '../log'
import de from './de'
import en from './en'

const getMessageFormat = memoizeFormatConstructor(IntlMessageFormat)

export class Formatter {

  constructor ({defaultLocale, locales = {}} = {}) {
    this.defaultLocale = defaultLocale
    this.locales = locales
  }

  formatMessage(id, values = {}, locale = this.defaultLocale) {
    const message = this.resolveMessageId(id, locale)

    // Avoid expensive message formatting for simple messages without values. In
    // development messages will always be formatted in case of missing values.
    if (process.env.NODE_ENV === 'production' && Object.keys(values).length === 0) return message

    try {
        const formatter = getMessageFormat(message, locale)
        const formatted = formatter.format(values)
        return formatted
    } catch (err) {
      log.warn({err, locale, id, values}, 'cannot format message')
      return id
    }
  }

  resolveMessageId (id, locale) {
    const localeDescriptor = this.locales[locale]
    if (!localeDescriptor) {
      log.warn({locale}, 'undefined locale')
      return id
    }

    const message = localeDescriptor.messages ? localeDescriptor.messages[id] : null
    if (!message) {
      if (localeDescriptor.parent) return this.resolveMessageId(id, localeDescriptor.parent)
      log.warn({id, locale}, 'undefined message in locale')
      return id
    }

    return message
  }

}

export default new Formatter({
  defaultLocale: 'de-DE',
  locales: {
    'de': {parent: 'en-US', messages: de},
    'de-DE': {parent: 'de'},

    'en': {messages: en},
    'en-US': {parent: 'en'}
  }
})
