import React, {PropTypes, Component} from 'react' // eslint-disable-line no-unused-vars
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Modal from 'react-modal'
import modalCss from './Modal.style'

export default class DhmModal extends Component {

  static propTypes = {
    closeIcon: PropTypes.bool,
    onRequestClose: PropTypes.func,
    children: PropTypes.node,
    style: PropTypes.object
  }

  static defaultProps = {
    closeIcon: true
  }

  handleCloseIconClick = (e) => {
    if (this.props.onRequestClose) this.props.onRequestClose('closeIcon')
  }

  render () {
    const {children, closeIcon, style, ...otherProps} = this.props
    const {inner, otherStyle} = style || {}

    return (
      <Modal overlayClassName={modalCss.overlay} className={modalCss.container} style={otherStyle} {...otherProps}>
        <div className={modalCss.inner} style={inner}>
          {closeIcon
            ? <div className={modalCss.closeIconContainer} onClick={this.handleCloseIconClick}><CloseIcon color='gray' /></div>
            : null}
          {children}
        </div>
      </Modal>
    )
  }
}
