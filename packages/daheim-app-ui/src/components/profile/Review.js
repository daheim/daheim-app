import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import moment from 'moment'
import {FormattedMessage} from 'react-intl'

import ProficiencyRating from '../ProficiencyRating'

import {H3, Button, Text, Flex, Box, HSpace, Avatar} from '../Basic'
import {Padding} from '../../styles'

class Review extends Component {

  static propTypes = {
    user: PropTypes.object,
    userMeta: PropTypes.object,
    review: PropTypes.object.isRequired,
    reviewEditable: PropTypes.bool,
    loadUser: PropTypes.func.isRequired,
    onRequestEdit: PropTypes.func
  }

  componentWillMount () {
    const {user, userMeta} = this.props
    const {loading} = userMeta || {}

    // TODO: this is very not kosher
    if (!user && !loading) this.props.loadUser({id: this.props.review.from})
  }

  handleEditClick = (e) => {
    e.preventDefault()
    if (this.props.onRequestEdit) this.props.onRequestEdit()
  }

  handleProfileClick = () => {
    console.log('TODO open profile of ' + JSON.stringify(this.props.user || 'no user'))
    this.props.push(`/users/${this.props.user.id}`)
  }

  render () {
    const {review, user = {}, reviewEditable, style} = this.props
    const {from, rating, text, date} = review
    const {name = 'BenutzerIn', picture} = user

    const dateText = moment(date).format('LL')

    return (
      <div style={style}>
        <Flex align='start'>
          <Box style={{width: Padding.m}}/>
          <Avatar size='30px' src={picture} onClick={this.handleProfileClick} style={{cursor: 'pointer'}}/>
          <HSpace v={Padding.s}/>
          <div>
            <Text>
              <b onClick={this.handleProfileClick} style={{cursor: 'pointer'}}>{name}</b>&nbsp;
              <FormattedMessage id='profile.feedback.on'/> {dateText}
            </Text>
            <Text>{text || <ProficiencyRating value={String(rating)} readOnly/>}</Text>
          </div>
        </Flex>
        {reviewEditable &&
          <Flex justify='flex-end' style={{width: '100%'}}>
            <Button
              onClick={this.handleEditClick}
              style={{width: 'auto', height: 'auto', padding: '5px 10px'}}
              >
              <H3><FormattedMessage id='profile.editFeedback'/></H3>
            </Button>
          </Flex>
        }
      </div>
    )
  }
}

export default connect((state, props) => {
  const {review} = props
  const {from} = review
  const user = state.users.users[from]
  const userMeta = state.users.usersMeta[from]

  return {user, userMeta}
}, {push})(Review)
