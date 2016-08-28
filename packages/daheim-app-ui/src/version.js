import pack from '../package.json'

export default {
  version: pack.version,
  environment: process.env.NODE_ENV
}
