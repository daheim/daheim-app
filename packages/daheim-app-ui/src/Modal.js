import React, {PropTypes, Component} from 'react' // eslint-disable-line no-unused-vars
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import Modal from 'react-modal'
import modalCss from './Modal.style'

import {VSpace} from './components/Basic'
import {Layout, Padding, Color} from './styles'

export default class DhmModal extends Component {

  static propTypes = {
    color: PropTypes.string,
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
    const {color, children, closeIcon, style, ...otherProps} = this.props
    const {inner={}, otherStyle={}} = style || {}
    inner.borderColor = color || Color.lightBlue

    return (
      <Modal
        overlayClassName={modalCss.overlay}
        className={modalCss.container}
        style={otherStyle}
        {...otherProps}
        contentLabel=''
        >
        <div style={{paddingTop: `${Layout.topbarHeightPx}px`, height: '100%'}}>
          <div style={{transform: 'translateZ(0)', height: '100%'}}>
            <div className={modalCss.inner} style={inner}>
              {closeIcon &&
                <div
                  className={modalCss.closeIconContainer}
                  onClick={this.handleCloseIconClick}
                  >
                  <CloseIcon color={color || Color.lightBlue}/>
                </div>
              }
              {children}
            </div>
          </div>
        </div>
        <VSpace v={Padding.s}/>
      </Modal>
    )
  }
}
