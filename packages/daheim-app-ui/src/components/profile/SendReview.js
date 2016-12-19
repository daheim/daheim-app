import React, {PropTypes, Component} from 'react'
import ProficiencyRating from '../ProficiencyRating'
import RaisedButton from 'material-ui/RaisedButton'
import {FormattedMessage} from 'react-intl'

export default class SendReview extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func,
    sendReview: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
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

  render () {
    const {user} = this.props
    const {text, rating} = this.state
    const {name = 'mich'} = user

    return (
      <form>
        <div><textarea placeholder={this.props.intl.formatMessage({id: 'sendReview.pleaseDropAFewLines', values: name})}
          style={{width: '100%', height: 100, borderRadius: 4, fontSize: 14, padding: 6, borderColor: '#AAA', marginTop: 2}} value={text} onChange={this.handleTextChange} /></div>
        <div style={{marginBottom: 8}}><FormattedMessage id='sendReview.germanLanguageKnowlegde' />:</div>
        <div style={{marginBottom: 8}}><ProficiencyRating value={String(rating)} onChange={this.handleRatingChange} /></div>
        <div><RaisedButton label={this.props.intl.formatMessage({id: 'sendReview.save'})} primary onClick={this.handleSend} /></div>
      </form>
    )
  }
}
