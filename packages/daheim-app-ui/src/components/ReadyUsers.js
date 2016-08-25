import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import StartLesson from './StartLesson'
import {startLesson} from '../actions/live'
import {loadUser} from '../actions/users'

import style from './ReadyUsers.style'

class ReadyUser extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    startLesson: PropTypes.func.isRequired,
    onSelect: PropTypes.func
  }

  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate

  handleClick = async (e) => {
    e.preventDefault()
    if (this.props.onSelect) this.props.onSelect(this.props.user)
  }

  render () {
    const {user, ...props} = this.props
    const {picture, name, germanLevel} = user
    return (
      <div href='#' className={`readyUser ${style.readyUser}`} onClick={this.handleClick} {...props}>
        <img className={style.picture} src={picture} />
        <div className={style.content}>
          <div className={style.name}>{name}</div>
          <div className={style.level}>Stufe: {germanLevel} / 5</div>
          <div className={style.topic}><a href='#'>Los geht's</a></div>
        </div>
      </div>
    )
  }
}

class ReadyUsers extends Component {

  static propTypes = {
    readyUsers: PropTypes.array.isRequired,
    users: PropTypes.object.isRequired,
    loadUser: PropTypes.func.isRequired,
    startLesson: PropTypes.func.isRequired
  }

  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate

  componentWillMount () {
    this.checkUsers(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.readyUsers !== nextProps.readyUsers) this.checkUsers(nextProps)
  }

  checkUsers (props) {
    const usersToLoad = {}
    const {readyUsers, users, usersMeta} = props

    for (let {id} of readyUsers) {
      if (users[id] || (usersMeta[id] && usersMeta[id].loading)) continue
      usersToLoad[id] = 1
    }

    for (let id in usersToLoad) this.props.loadUser({id}).suppressUnhandledRejections()
  }

  state = {
    selectedUser: undefined
  }

  unselectUser = () => {
    this.setState({selectedUser: undefined})
  }

  selectUser = (user) => {
    this.setState({selectedUser: user})
  }

  render () {
    const {users, readyUsers, startLesson} = this.props
    const {selectedUser} = this.state

    return (
      <div>
        <h2>SchülerInnen Online</h2>
        {readyUsers.length === 0 ? (
          <div>Es tut uns leid, leider sind gerade keine passenden Gesprächspartner online.</div>
        ) : (
          readyUsers.map(({id}) => {
            const user = users[id]
            if (!user) return
            return <ReadyUser key={user.id} user={user} startLesson={startLesson} onSelect={this.selectUser} />
          })
        )}

        {selectedUser ? <StartLesson key={selectedUser.id} user={selectedUser} onRequestClose={this.unselectUser} /> : undefined}
      </div>
    )
  }
}

export default connect((state) => {
  const {users: {users, usersMeta}, live: {readyUsers}} = state
  return {users, usersMeta, readyUsers}
}, {startLesson, loadUser})(ReadyUsers)

