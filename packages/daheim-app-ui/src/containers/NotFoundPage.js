import React from 'react'
import {goBack} from 'react-router-redux'
import {connect} from 'react-redux'

class NotFoundPage extends React.Component {

  static propTypes = {
    goBack: React.PropTypes.func.isRequired
  }

  goBack = (e) => {
    e.preventDefault()
    this.props.goBack()
  }

  render () {
    return (
      <div style={{maxWidth: 400, margin: '0 auto', padding: '16px 10px'}}>
        <div style={{background: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: 20, paddingTop: 12}}>
          <h1 style={{textAlign: 'center'}}>vier null vier</h1>
          <p>Seite nicht gefunden. <a href='#' onClick={this.goBack}>Zurück.</a></p>
        </div>
      </div>
    )
  }

}

export default connect(null, {goBack})(NotFoundPage)
