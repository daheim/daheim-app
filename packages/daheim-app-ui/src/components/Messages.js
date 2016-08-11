import React from 'react'
import {connect} from 'react-redux'
import Snackbar from 'material-ui/lib/snackbar'
import {closeMessages} from '../actions/messages'

class Messages extends React.Component {

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    current: React.PropTypes.object.isRequired,
    closeMessages: React.PropTypes.func.isRequired
  }

  handleRequestClose = (reason) => {
    if (this.props.current.closeDisabled) return
    this.props.closeMessages()
  }

  render () {
    const { open, current } = this.props
    return (
      <Snackbar
        open={open}
        message={current.message || ''}
        autoHideDuration={current.autoHideDuration || 5000}
        onRequestClose={this.handleRequestClose} />
    )
  }

}

export default connect((state, ownProps) => {
  const { open, current } = state.messages
  return { open, current }
}, { closeMessages })(Messages)
