import fs from 'fs'
import path from 'path'
import version from './version'

const config = {version}
const content = fs.readFileSync(path.join(__dirname, '../static/sw.js'), 'utf-8')
  .replace('{{CONFIG}}', JSON.stringify(config).replace('\'', '\\\''))

export default function sendServiceWorker (req, res) {
  res.set('Content-Type', 'text/javascript;charset=utf-8')
  if (process.env.NODE_ENV !== 'development') res.set('Cache-Control', 'max-age=60')
  res.send(content)
}
