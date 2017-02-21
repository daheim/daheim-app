import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl'
import styled from 'styled-components'
import {Link} from 'react-router'

import StartLesson from './StartLesson'
import {startLesson} from '../actions/live'
import {loadUser} from '../actions/users'

import {H2, H3, Text, Flex, VSpace, Avatar, Button} from './Basic'
import {Layout, Padding} from '../styles'

const rowSpacing = Padding.l
const entryStyle = { width: Layout.widthPx / 4.5, marginRight: Padding.m, marginBottom: rowSpacing }

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -${rowSpacing};
  @media (max-width: ${Layout.mobileBreakpoint}) {
    justify-content: center;
  }
`

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

  handleProfile = () => {
    alert('TODO: show profile of ' + JSON.stringify(this.props.user))
  }

  render () {
    const {user} = this.props
    const {picture, name} = user
    return (
      <Flex column align='center' style={entryStyle}>
        <Avatar size='100px' src={picture} onClick={this.handleClick} style={{cursor: 'pointer'}}/>
        <Text onClick={this.handleClick} style={{cursor: 'pointer'}}>{name}</Text>
        <VSpace v={Padding.m}/>
        <Link to={`/users/${user.id}`} style={{width: '100%'}}>
          <Button primary style={{width: '100%'}}>
            <H3>Profil ansehen</H3>
          </Button>
        </Link>
      </Flex>
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
      <div style={{width: '100%'}}>
        <H2><FormattedMessage id='ready.users.title'/></H2>
        <VSpace v={Padding.m}/>
        {readyUsers.length === 0 ? (
          <Flex column style={{maxWidth: Layout.widthPx * 0.4, margin: '0 auto'}}>
            <VSpace v={Padding.m}/>
            <Text>
              <FormattedHTMLMessage id='ready.users.empty' values={{link: 'https://willkommen-daheim.org/hilfe/#Deutsch-vermitteln'}}/>
            </Text>
          </Flex>
        ) : (
          <Container>
            {readyUsers.map(({id}) => {
              const user = users[id]
              if (!user) return
              return <ReadyUser key={user.id} user={user} startLesson={startLesson} onSelect={this.selectUser} />
            })}
          </Container>
        )}

        {selectedUser &&
          <StartLesson
            key={selectedUser.id}
            user={selectedUser}
            onRequestClose={this.unselectUser}
          />
        }
      </div>
    )
  }
}

export default connect((state) => {
  const {users: {users, usersMeta}, live: {readyUsers}} = state
  return {users, usersMeta, readyUsers}
}, {startLesson, loadUser})(ReadyUsers)

