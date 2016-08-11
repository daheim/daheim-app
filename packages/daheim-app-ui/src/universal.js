import WebpackIsomorphicTools from 'webpack-isomorphic-tools'
import universalConfig from '../webpack/universal'

export default new WebpackIsomorphicTools(universalConfig)
  .development(process.env.NODE_ENV === 'development')
