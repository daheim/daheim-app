import React, {PropTypes, Component} from 'react'
import {FormattedMessage, injectIntl} from 'react-intl'

import {H3, Flex, HSpace, Avatar, Button, TextArea} from '../Basic'
import {Padding} from '../../styles'

class SendReviewRaw extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func,
    sendReview: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    const {myReview} = props.user
    const {text = '', rating = 1} = myReview || {}
    this.state = {text, rating}
  }

  handleTextChange = (e) => {
    this.setState({text: e.target.value, dirty: true})
  }

  handleRatingChange = (e) => {
    this.setState({rating: parseInt(e.target.value), dirty: true})
  }

  handleSend = async (e) => {
    if (this.state.running) return

    this.setState({running: true})
    try {
      await this.props.sendReview({
        to: this.props.user.id,
        text: this.state.text,
        rating: this.state.rating
      })
      if (this.props.onRequestClose) this.props.onRequestClose()
    } catch (err) {
      // TODO: handle error
      console.log('error', err)
    } finally {
      // TODO: might be called on closed component
      this.setState({running: false})
    }
  }

  handleLater = () => {
    if (this.props.onRequestClose) this.props.onRequestClose()
  }

  render () {
    const {user, intl} = this.props
    const {text, rating} = this.state
    const {name = 'mich'} = user

    return (
      <form>
        <div>
          <TextArea
            placeholder={intl.formatMessage({id: 'profile.feedbackPlaceholder'})}
            style={{}}
            value={text}
            onChange={this.handleTextChange}
          />
        </div>
        <Flex style={{width: '100%'}}>
          <Button
            neutral
            onClick={this.handleSend}
            style={{width: 'auto', height: 'auto', padding: '5px 10px', flexBasis: 0, flexGrow: 1}}
            >
            <H3><FormattedMessage id='profile.saveFeedback'/></H3>
          </Button>
          <HSpace v={Padding.s}/>
          <Button
            neg
            onClick={this.handleLater}
            style={{width: 'auto', height: 'auto', padding: '5px 10px', flexBasis: 0, flexGrow: 1}}
            >
            <H3><FormattedMessage id='profile.saveFeedbackLater'/></H3>
          </Button>
        </Flex>
      </form>
    )
  }
}

export default injectIntl(SendReviewRaw)