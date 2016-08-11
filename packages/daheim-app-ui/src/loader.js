import React, {Component} from 'react'

export default function loader (def) {
  return function wrapWithLoader (WrappedComponent) {
    const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
    const displayName = `Loader(${componentName})`

    class Loader extends Component {
      static displayName = displayName

      componentWillMount () {
        def.load(this.props)
      }

      componentWillReceiveProps (nextProps) {
        if (def.shouldReload(this.props, nextProps)) def.load(nextProps)
      }

      render () {
        const loaded = def.isLoaded(this.props)

        if (!loaded) {
          if (typeof def.loadingElement === 'function') return def.loadingElement(this.props)
          return def.loadingElement || <div>Loading...</div>
        }

        const key = typeof def.key === 'function' ? def.key(this.props) : def.key

        return <WrappedComponent key={key} {...this.props} />
      }
    }

    return Loader
  }
}
