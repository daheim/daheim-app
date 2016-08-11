import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import moment from 'moment'

import ProficiencyRating from '../ProficiencyRating'

import css from './ProfilePage.style'

class Review extends Component {

  static propTypes = {
    user: PropTypes.object,
    userMeta: PropTypes.object,
    review: PropTypes.object.isRequired,
    mine: PropTypes.bool,
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

  render () {
    const {review, user = {}, mine} = this.props
    const {from, rating, text, date} = review
    const {name = 'BenutzerIn', picture} = user

    const dateText = moment(date).format('LL')

    return (
      <div className={css.field}>
        <div className={css.fieldTitle}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <img src={picture} style={{width: 28, height: 28, borderRadius: '50%', boxShadow: '0 1px 1px 1px rgba(0,0,0,.1)', border: 'solid 1px white'}} />
            <div style={{marginLeft: 8}}>
              <Link to={`/users/${from}`}>{name}</Link>
              <span style={{fontSize: 10, color: '#aaa'}}> {dateText}</span>
              {mine ? <span> <a style={{fontSize: 10}} href='#' onClick={this.handleEditClick}>bearbeiten</a></span> : undefined}
            </div>
          </div>
        </div>
        <div style={{marginLeft: 36}} className={css.fieldText}>
          <ProficiencyRating itemStyle={{marginBottom: 8}} value={String(rating)} readOnly />
          <div>{text}</div>
        </div>
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
}, {})(Review)
