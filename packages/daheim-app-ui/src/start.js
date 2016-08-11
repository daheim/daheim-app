import path from 'path'
import universal from './universal'
const rootDir = path.resolve(__dirname, '..')

universal.server(rootDir, () => {
  require('./server')
})
