import React, {PropTypes} from 'react'

import style from './Logo.style'

export default class Logo extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    color: PropTypes.string
  }

  static defaultProps = {
    color: 'black'
  }

  render () {
    const {color, ...rest} = this.props

    return (
      <div {...rest}>
        <img src='/daheim-horizontal-logo3.svg' style={{height: 36, marginTop: 4, marginLeft: 8}} />
        <span className={style.motto} style={{color}}>Reden. Lernen. Leben.</span>
      </div>
    )
  }

}
