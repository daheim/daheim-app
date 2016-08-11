import React from 'react'

export default class Panel extends React.Component {

  static propTypes = {
    style: React.PropTypes.object,
    children: React.PropTypes.node
  };

  render () {
    return (
      <div style={Object.assign({background: 'rgba(255,255,255,0.9)', borderRadius: 6, padding: 20, paddingTop: 12, margin: 10, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)'}, this.props.style)}>
        {this.props.children}
      </div>
    )
  }

}
