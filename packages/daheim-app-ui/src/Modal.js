import React, {PropTypes, Component} from 'react' // eslint-disable-line no-unused-vars
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Modal from 'react-modal'
import modalCss from './Modal.style'

export default class DhmModal extends Component {

  static propTypes = {
    closeIcon: PropTypes.bool,
    onRequestClose: PropTypes.func,
    children: PropTypes.node
  }

  static defaultProps = {
    closeIcon: true
  }

  handleCloseIconClick = (e) => {
    if (this.props.onRequestClose) this.props.onRequestClose('closeIcon')
  }

  render () {
    const {children, closeIcon, ...otherProps} = this.props

    return (
      <Modal overlayClassName={modalCss.overlay} className={modalCss.container} {...otherProps}>
        <div className={modalCss.inner}>
          {closeIcon
            ? <div className={modalCss.closeIconContainer}><CloseIcon className={modalCss.closeIcon} color='gray' onClick={this.handleCloseIconClick} /></div>
            : null}
          {children}
        </div>
      </Modal>
    )
  }
}
