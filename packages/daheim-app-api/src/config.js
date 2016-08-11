import convict from 'convict'

const LEGAL_BOOLEAN = {
  '1': true,
  '0': false,
  'true': true,
  'false': false,
}

convict.addFormat({
  name: 'boolean',
  validate: val => {
    if (LEGAL_BOOLEAN[val] === undefined) {
      throw new Error('must be on of ' + Object.keys(LEGAL_BOOLEAN))
    }
  },
  coerce: val => LEGAL_BOOLEAN[val],
})

convict.addFormat({
  name: 'json-array',
  validate: val => {
    if (!Array.isArray(val)) {
      throw new Error('must be a JSON array')
    }
  },
  coerce: val => {
    try {
      return JSON.parse(val)
    } catch (err) {
      return
    }
  },
})

var conf = convict({
  ice: {
    useDefaultServers: {
      doc: 'Enable default ICE servers (default true)',
      format: 'boolean',
      default: true,
      env: 'ICE_USE_DEFAULT_SERVERS',
    },
    servers: {
      doc: 'Additional static servers in JSON array format (default [])',
      format: 'json-array',
      default: [],
      env: 'ICE_SERVERS',
    },
  },
})

conf.validate({strict: true})

export default conf
