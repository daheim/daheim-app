import React, {PropTypes, Component} from 'react'
import Modal from 'react-modal'
import modalCss from './Modal.style'

export default class DhmModal extends Component {
  render () {
    return <Modal overlayClassName={modalCss.overlay} className={modalCss.container} {...this.props} />
  }
}
