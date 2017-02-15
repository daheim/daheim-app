/* eslint-env browser */

import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import md5 from 'md5'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import {push} from 'react-router-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {FormattedMessage, injectIntl} from 'react-intl'

import {saveProfile} from '../../actions/profile'
import ProficiencyRating from '../ProficiencyRating'
import TimeToChoose from '../ready/TimeToChoose'

import {Layout, Padding, Color, Fontsize} from '../../styles'
import {H1, H2, DropDownMenu, Text, Button, HSpace, VSpace, TextField, Flex, Box,
        Checkbox, InterestType, Interest} from '../Basic'

const avatars = {
  avatar1: 'https://assets.willkommen-daheim.org/public/assets/avatar-1.svg',
  avatar2: 'https://assets.willkommen-daheim.org/public/assets/avatar-2.svg',
  avatar3: 'https://assets.willkommen-daheim.org/public/assets/avatar-3.svg',
  avatar4: 'https://assets.willkommen-daheim.org/public/assets/avatar-4.svg',
  avatar5: 'https://assets.willkommen-daheim.org/public/assets/avatar-5.svg',
  avatar6: 'https://assets.willkommen-daheim.org/public/assets/avatar-6.svg',
  avatar7: 'https://assets.willkommen-daheim.org/public/assets/avatar-7.svg',
  avatar9: 'https://assets.willkommen-daheim.org/public/assets/avatar-9.svg',
  avatar10: 'https://assets.willkommen-daheim.org/public/assets/avatar-10.svg',
  avatar11: 'https://assets.willkommen-daheim.org/public/assets/avatar-11.svg',
  avatar12: 'https://assets.willkommen-daheim.org/public/assets/avatar-12.svg'
}

class LanguagesRaw extends Component {

  static propTypes = {
    inGermanySince: PropTypes.string.isRequired,
    languages: PropTypes.object.isRequired,
    germanLevel: PropTypes.number.isRequired,
    intl: PropTypes.object.isRequired,
    role: PropTypes.string,
    onChange: PropTypes.func
  }

  static suggestions = [
    'Arabisch – AR', 'Albanisch – SQ', 'Armenisch – HY', 'Chinesisch – ZH', 'Dari – FA', 'Englisch – EN',
    'Farsi – FA', 'Französisch – FR', 'Griechisch – EL', 'Hindi – HI', 'Italienisch – IT', 'Kroatisch – HR',
    'Kurdisch – KU', 'Paschtu – FA', 'Polnisch – PL', 'Portugiesisch – PT', 'Rumänisch – RM', 'Russisch – RU',
    'Spanisch – ES', 'Serbisch – SR', 'Türkisch – TR'
  ]

  state = {
    extraLanguage: '',
    extraLanguageChecked: false,
  }

  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate

  handleInGermanySinceChange = (inGermanySince) => {
    if (this.props.onChange) this.props.onChange({inGermanySince})
  }

  handleLanguageCheck = (languages) => {
    if (this.props.onChange) this.props.onChange({languages})
  }

  handleExtraLanguage = (e) => {
    const oldExtraLanguage = this.state.extraLanguage
    const extraLanguage = e.target.value
    this.setState({extraLanguage})
    if (!this.state.extraLanguageChecked) return
    const languages = {...this.props.languages}
    delete languages[oldExtraLanguage]
    languages[extraLanguage] = true
    this.setState({extraLanguageChecked: false, extraLanguage: ''})
    this.handleLanguageCheck(languages)
  }

  handleExtraLanguageCheck = () => {
    const newChecked = !this.state.extraLanguageChecked
    this.setState({extraLanguageChecked: newChecked})
    this.state.extraLanguageChecked = newChecked // setState is async...
    this.handleExtraLanguage({target: {value: this.state.extraLanguage}})
  }

  handleGermanLevelChange = (e) => {
    const germanLevel = parseInt(e.target.value)
    if (this.props.onChange) this.props.onChange({germanLevel})
  }

  render () {
    const {intl, inGermanySince, germanLevel, languages, role} = this.props
    const showStudentFields = role !== 'teacher'

    const leftovers = {...languages}
    LanguagesRaw.suggestions.forEach((suggestion) => delete leftovers[suggestion])
    const ls = [...LanguagesRaw.suggestions, ...Object.keys(leftovers)]

    return (
      <Flex column wrap>
        {showStudentFields ? (
          <div>
            <H2><FormattedMessage id='editProfile.sinceWhen'/></H2>
            <VSpace v={Padding.m}/>
            <div>
              <DropDownMenu
                items={[
                  {value: '2017', label: '2017'},
                  {value: '2016', label: '2016'},
                  {value: '2015', label: '2015'},
                  {value: '2014', label: '2014'},
                  {value: 'earlier', label: intl.formatMessage({id: 'editProfile.earlierThan2004'})},
                ]}
                selected={inGermanySince}
                onSelect={(e) => this.handleInGermanySinceChange(e.value)}
              />
            </div>
            <VSpace v={Padding.l}/>

            <H2><FormattedMessage id='editProfile.germanLevel'/></H2>
            <VSpace v={Padding.m}/>
            <ProficiencyRating
              style={{marginLeft: Padding.m}}
              value={germanLevel.toString()}
              onChange={this.handleGermanLevelChange}
            />
            <VSpace v={Padding.l}/>
          </div>
        ) : null}

        <H2><FormattedMessage id='editProfile.otherLanguages'/></H2>
        <VSpace v={Padding.m}/>
        <Flex wrap style={{marginLeft: Padding.m}}>
          {ls.map(language =>
            <div key={language} style={{flex: '0 0 250px', margin: '4px 0'}}>
              <ValuedCheckbox
                values={languages}
                selector={language}
                onCheck={this.handleLanguageCheck}
              />
            </div>
          )}
        </Flex>
        <Flex align='center'>
          <Checkbox
            type='neutral'
            style={{marginLeft: Padding.m, marginTop: '4px'}}
            checked={this.state.extraLanguageChecked}
            onCheck={this.handleExtraLanguageCheck}
          />
          <TextField
            small neutral
            placeholder={intl.formatMessage({id: 'profile.additionalLanguage'})}
            value={this.state.extraLanguage}
            onChange={this.handleExtraLanguage}
          />
        </Flex>
      </Flex>
    )
  }
}
const Languages = injectIntl(LanguagesRaw)

class TopicsRaw extends React.Component {

  static propTypes = {
    topics: PropTypes.object.isRequired,
    introduction: PropTypes.string.isRequired,
    onChange: PropTypes.func
  }

  static suggestions = Object.keys(InterestType)

  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate

  handleCheck = (topics) => {
    if (this.props.onChange) this.props.onChange({topics})
  }

  handleIntroductionChage = (e) => {
    const introduction = e.target.value
    if (this.props.onChange) this.props.onChange({introduction})
  }

  render () {
    const {intl, topics, introduction} = this.props

    const leftovers = {...topics}
    TopicsRaw.suggestions.forEach((suggestion) => delete leftovers[suggestion])

    return (
      <Flex column>
        <H2><FormattedMessage id='editProfile.likeToTalkAbout'/></H2>
        <VSpace v={Padding.m}/>
        <Flex wrap style={{marginLeft: Padding.m}}>
          {[...TopicsRaw.suggestions, ...Object.keys(leftovers)].map((topic) =>
            <div key={topic} style={{flex: '0 0 250px', margin: '4px 0'}}>
              <ValuedCheckbox values={topics} selector={topic} onCheck={this.handleCheck} />
            </div>
          )}
        </Flex>

        <VSpace v={Padding.l}/>

        <H2><FormattedMessage id='editProfile.aboutYou'/></H2>
        <VSpace v={Padding.m}/>
        <div style={{maxWidth: 550}}>
          <textarea
            style={{
              width: '100%',
              height: 150,
              color: Color.lightBlue,
              border: `2.666px solid ${Color.lightBlue}`,
              borderRadius: 4,
              fontSize: Fontsize.m,
              fontFamily: 'Rambla',
              padding: 4,
            }}
            value={introduction}
            placeholder={intl.formatMessage({id: 'editProfile.aboutYouPlaceholder'})}
            onChange={this.handleIntroductionChage}
          />
        </div>
      </Flex>
    )
  }
}
const Topics = injectIntl(TopicsRaw)

class ValuedCheckbox extends React.Component {

  static propTypes = {
    values: PropTypes.object.isRequired,
    selector: PropTypes.string.isRequired,
    onCheck: PropTypes.func.isRequired
  }

  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate

  handleCheck = (e, checked) => {
    const {values, selector} = this.props
    const copy = {...values, [selector]: checked}
    this.props.onCheck(copy)
  }

  render () {
    const {values, selector} = this.props
    const isPredefinedInterest = InterestType[selector] != null
    return (
      <Checkbox
        type='neutral'
        checked={!!values[selector]}
        onCheck={this.handleCheck}
      >
        {isPredefinedInterest ? (
          <Interest interest={selector}/>
        ) : (
          selector
        )}
      </Checkbox>
    )
  }
}

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  padding-top: ${Padding.xl};
  flex-direction: column;
  align-items: center;
`

const ProgressBarBg = styled.div`
  position: relative;
  height: 30px;
  background: ${Color.lightBlue};
  border-radius: 6px;
`

const ProgressBarFg = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: ${Color.blue};
  color: white;
  border-radius: 6px;
  font-weight: bold;
  font-size: ${Fontsize.l};
`

const ProgressBar = ({v}) => {
  return (
    <div style={{width: '47%'}}>
      <Text><FormattedMessage id='editProfile.progress' values={{percent: v.toString()}}/></Text>
      <VSpace v={Padding.s}/>
      <ProgressBarBg>
        <ProgressBarFg style={{width: `${v}%`}}>
          {v}%
        </ProgressBarFg>
      </ProgressBarBg>
    </div>
  )
}

class ProfilePageRaw extends React.Component {

  static propTypes = {
    user: React.PropTypes.object.isRequired,
    saveProfile: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    const {profile} = this.props.user

    let step
    if (profile.completed) step = 'complete'
    else if (profile.role == null || profile.role === '') step = 'role'
    else step = 'basic'

    this.state = {
      step: step,
      picture: profile.picture,
      gender: profile.gender,
      name: profile.name || '',
      topics: profile.topics || {},
      languages: profile.languages || {},
      inGermanySince: profile.inGermanySince || '2016',
      germanLevel: profile.germanLevel || 1,
      introduction: profile.introduction || ''
    }
  }

  handleChange = (opt) => {
    this.setState(opt)
  }

  gravatarUrl = (() => {
    const {user = {}} = this.props
    const {username = ''} = user
    const hash = md5(username.trim().toLowerCase())
    // const {devicePixelRatio = 1} = window || {}
    return `https://secure.gravatar.com/avatar/${hash}?s=256&d=monsterid&r=x`
  })()

  handleContinue = () => {
    let scrollToTop = true
    const step = this.state.step
    if (step === 'role') this.setState({step: 'basic'})
    else if (step === 'basic') this.setState({step: 'languages'})
    else if (step === 'languages') this.setState({step: 'interests'})
    else {
      scrollToTop = false
      this.handleSave().then()
    }
    if (scrollToTop) {
      window.scrollY = 0
    }
  }

  handleBack = () => {
    window.scrollY = 0
    const step = this.state.step
    if (step === 'basic') this.setState({step: 'role'})
    else if (step === 'languages') this.setState({step: 'basic'})
    else if (step === 'interests') this.setState({step: 'languages'})
  }

  stepToProgress = () => {
    switch (this.state.step) {
      case 'role': return 25
      case 'basic': return 50
      case 'languages': return 75
      default: return 100
    }
  }

  handleSave = async () => {
    const prof = {
      ...this.state,
      picture: undefined,
      pictureType: this.pictureType,
      pictureData: this.pictureData
    }

    try {
      await this.props.saveProfile(prof)
      this.props.push('/')
    } catch (err) {
      console.error(err) // TODO: handle error
    }
  }

  handleGravatarClick = (e) => {
    e.preventDefault()
    this.pictureType = 'gravatar'
    this.setState({picture: this.gravatarUrl})
  }

  handleAvatarClick = (e, key) => {
    e.preventDefault()
    this.pictureType = 'avatar'
    this.pictureData = key
    this.setState({picture: avatars[key]})
  }

  handleNameChange = (e) => {
    this.setState({name: e.target.value})
  }

  cancel = (e) => {
    e.preventDefault()
  }

  handleDrop = ([file]) => {
    const img = new Image()
    const fr = new FileReader()
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256

    fr.onload = () => {
      img.onload = () => {
        const ctx = canvas.getContext('2d')
        const ratio = Math.max(canvas.width / img.width, canvas.height / img.height)
        const centerShiftX = (canvas.width - img.width * ratio) / 2
        const centerShiftY = (canvas.height - img.height * ratio) / 2
        ctx.drawImage(img, 0, 0, img.width, img.height,
          centerShiftX, centerShiftY, img.width * ratio, img.height * ratio)

        const data = canvas.toDataURL('image/png')
        this.pictureType = 'data'
        this.pictureData = data
        this.setState({picture: data})
      }
      img.src = fr.result
    }
    fr.readAsDataURL(file)
  }

  renderStepRole() {
    return <TimeToChoose onFinished={this.handleContinue}/>
  }

  renderStepBasic() {
    const intl = this.props.intl
    const {name, gender, picture} = this.state
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <div style={{flex: '1 1 400px'}}>
          <Box auto style={{maxWidth: Layout.widthPx / 2}}>
            <TextField
              neutral
              bigLabel
              placeholder={intl.formatMessage({id: 'editProfile.namePlaceholder' })}
              label={intl.formatMessage({id: 'editProfile.nameLabel' })}
              value={name}
              onChange={this.handleNameChange}
            />
            <VSpace v={Padding.m}/>

            <H2><FormattedMessage id='editProfile.genderLabel'/></H2>
            <VSpace v={Padding.s}/>
            <Flex auto>
              <Checkbox
                type='neutral'
                label={intl.formatMessage({id: 'editProfile.genderW'})}
                checked={gender === 'w'}
                onCheck={() => this.setState({ gender: 'w' })}
              />
              <HSpace v={Padding.m}/>
              <Checkbox
                type='neutral'
                label={intl.formatMessage({id: 'editProfile.genderM'})}
                checked={gender === 'm'}
                onCheck={() => this.setState({ gender: 'm' })}
              />
              <HSpace v={Padding.m}/>
              <Checkbox
                type='neutral'
                label={intl.formatMessage({id: 'editProfile.genderX'})}
                checked={gender !== 'm' && gender !== 'w'}
                onCheck={() => this.setState({ gender: 'x' })}
              />
            </Flex>
          </Box>

          <VSpace v={Padding.l}/>

          <H2><FormattedMessage id='editProfile.profilePicture'/></H2>
          <VSpace v={Padding.m}/>
          <div style={{display: 'flex'}}>
            <Dropzone
              accept='image/*'
              style={{cursor: 'pointer', flex: '0 0 auto', margin: 5, padding: 5}}
              activeStyle={{backgroundColor: '#eee'}}
              onDrop={this.handleDrop}
            >
              <div>
                <img style={{borderRadius: '50%', width: 128, height: 128}} src={picture} />
              </div>
              <div style={{textAlign: 'center'}}>
                <a href='#' onClick={this.cancel}><FormattedMessage id='editProfile.uploadPicture' /></a>
              </div>
            </Dropzone>
            <div style={{margin: 10}}>
              <div>
                <a style={{margin: 5}} href='#' title='Use gravatar' onClick={this.handleGravatarClick}><img src={this.gravatarUrl} style={{borderRadius: '50%', width: 64, height: 64}} /></a>
                {Object.keys(avatars).map((key) => {
                  const handler = (e) => this.handleAvatarClick(e, key)
                  return <a key={key} style={{margin: 5}} href='#' title='Use avatar' onClick={handler}><img src={avatars[key]} style={{borderRadius: '50%', width: 64, height: 64}} /></a>
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderStepLanguages() {
    const {languages, inGermanySince, germanLevel} = this.state
    const {role} = this.props.user.profile
    return (
      <Languages
        role={role}
        languages={languages}
        inGermanySince={inGermanySince}
        germanLevel={germanLevel}
        onChange={this.handleChange}
      />
    )
  }

  renderStepInterests() {
    const {topics, introduction} = this.state
    return (
      <Topics
        topics={topics}
        introduction={introduction}
        onChange={this.handleChange}
      />
    )
  }

  renderFirstTime() {
    const {step, languages} = this.state
    const {role} = this.props.user.profile
    const progress = this.stepToProgress(step)
    const continueId = step === 'complete'
      ? 'editProfile.save'
      : progress === 100 ? 'editProfile.finished' : 'editProfile.continue'
    let inner
    if (step === 'role') inner = this.renderStepRole()
    else if (step === 'basic') inner = this.renderStepBasic()
    else if (step === 'languages') inner = this.renderStepLanguages()
    else inner = this.renderStepInterests()
    return (
      <div>
        <HeaderContainer>
          <H1><FormattedMessage id='editProfile.title'/></H1>
          <VSpace v={Padding.m}/>
          <ProgressBar v={progress}/>
        </HeaderContainer>
        <VSpace v={Padding.xl}/>
        <VSpace v={Padding.l}/>
        {inner}
        {step !== 'role' &&
          <div>
            <VSpace v={Padding.l}/>
            <Flex style={{width: '100%'}} justify='center'>
              <Button onClick={this.handleBack}>
                <FormattedMessage id='editProfile.back'/>
              </Button>
              <HSpace v={Padding.s}/>
              <Button primary onClick={this.handleContinue}>
                <FormattedMessage id={continueId}/>
              </Button>
            </Flex>
          </div>
        }
      </div>
    )
  }

  render () {
    const {step} = this.state
    if (step !== 'complete') return this.renderFirstTime()
    return (
      <div>
        <HeaderContainer>
          <H1><FormattedMessage id='editProfile.titleComplete'/></H1>
          <VSpace v={Padding.m}/>
        </HeaderContainer>
        <VSpace v={Padding.l}/>
        {this.renderStepBasic()}
        <VSpace v={Padding.l}/>
        {this.renderStepLanguages()}
        <VSpace v={Padding.l}/>
        {this.renderStepInterests()}
        <div>
          <VSpace v={Padding.l}/>
          <Flex style={{width: '100%'}} justify='center'>
            <Button onClick={() => this.props.push('/')}>
              <FormattedMessage id='editProfile.back'/>
            </Button>
            <HSpace v={Padding.s}/>
            <Button primary onClick={this.handleSave}>
              <FormattedMessage id={'editProfile.save'}/>
            </Button>
          </Flex>
        </div>
      </div>
    )
  }

}
const ProfilePage = injectIntl(ProfilePageRaw)

class ProfileOrLoading extends React.Component {
  static propTypes = {
    user: React.PropTypes.object
  }

  render () {
    if (this.props.user) return <ProfilePage {...this.props} />
    else return <div><FormattedMessage id='editProfile.pleaseWait' /></div>
  }
}

export default connect((state, props) => {
  const user = state.profile.profile
  return {user}
}, {saveProfile, push})(ProfileOrLoading)
