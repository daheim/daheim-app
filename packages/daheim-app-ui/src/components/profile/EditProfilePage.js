import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import md5 from 'md5'
import Dropzone from 'react-dropzone'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import {push} from 'react-router-redux'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import {saveProfile} from '../../actions/profile'
import ProficiencyRating from '../ProficiencyRating'
import TimeToChoose from '../ready/TimeToChoose'

const avatars = {
  avatar1: 'https://assets.daheimapp.de/public/assets/avatar-1.svg',
  avatar2: 'https://assets.daheimapp.de/public/assets/avatar-2.svg',
  avatar3: 'https://assets.daheimapp.de/public/assets/avatar-3.svg',
  avatar4: 'https://assets.daheimapp.de/public/assets/avatar-4.svg',
  avatar5: 'https://assets.daheimapp.de/public/assets/avatar-5.svg',
  avatar6: 'https://assets.daheimapp.de/public/assets/avatar-6.svg',
  avatar7: 'https://assets.daheimapp.de/public/assets/avatar-7.svg',
  avatar9: 'https://assets.daheimapp.de/public/assets/avatar-9.svg',
  avatar10: 'https://assets.daheimapp.de/public/assets/avatar-10.svg',
  avatar11: 'https://assets.daheimapp.de/public/assets/avatar-11.svg',
  avatar12: 'https://assets.daheimapp.de/public/assets/avatar-12.svg'
}

class Languages extends Component {

  static propTypes = {
    inGermanySince: PropTypes.string.isRequired,
    languages: PropTypes.object.isRequired,
    germanLevel: PropTypes.number.isRequired,
    role: PropTypes.string,
    onChange: PropTypes.func
  }

  static suggestions = ['Englisch', 'Spanisch', 'Französisch', 'Italienisch', 'Russisch', 'Griechisch', 'Polnisch', 'Türkisch', 'Arabisch', 'Farsi', 'Hebräisch', 'Kurdisch']

  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate

  handleInGermanySinceChange = (e, key, inGermanySince) => {
    if (this.props.onChange) this.props.onChange({inGermanySince})
  }

  handleLanguageCheck = (languages) => {
    if (this.props.onChange) this.props.onChange({languages})
  }

  handleGermanLevelChange = (e) => {
    const germanLevel = parseInt(e.target.value)
    if (this.props.onChange) this.props.onChange({germanLevel})
  }

  render () {
    const {inGermanySince, germanLevel, languages, role} = this.props
    const showStudentFields = role !== 'teacher'

    const leftovers = {...languages}
    Languages.suggestions.forEach((suggestion) => delete leftovers[suggestion])

    return (
      <div style={{display: 'flex', flexWrap: 'wrap', marginTop: 20}}>
        <div style={{fontSize: 15, fontWeight: 700, marginBottom: 8, marginRight: 10, flex: '0 0 150px'}}>
          Sprache
        </div>

        <div style={{flex: '1 1 400px'}}>
          {showStudentFields ? (
            <div>
              <div style={{marginBottom: 8, fontWeight: 700, fontSize: 14}}>Seit wann wohnst du in Deutschland?</div>
              <div>
                <DropDownMenu value={inGermanySince} style={{marginTop: -10, marginLeft: -20}} onChange={this.handleInGermanySinceChange}>
                  <MenuItem value='2016' primaryText='2016' />
                  <MenuItem value='2015' primaryText='2015' />
                  <MenuItem value='2014' primaryText='2014' />
                  <MenuItem value='earlier' primaryText='Früher als 2014' />
                </DropDownMenu>
              </div>
              <div style={{marginBottom: 8, marginTop: 16, fontWeight: 700, fontSize: 14}}>Deutschkenntnis</div>
              <div><ProficiencyRating value={'' + germanLevel} onChange={this.handleGermanLevelChange} /></div>
            </div>
          ) : null}
          <div style={{marginBottom: 8, marginTop: showStudentFields ? 16 : 0, fontWeight: 700, fontSize: 14}}>Andere Sprachen</div>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {[...Languages.suggestions, ...Object.keys(leftovers)].map((language) =>
              <div key={language} style={{flex: '0 0 250px', margin: '4px 0'}}><ValuedCheckbox values={languages} selector={language} onCheck={this.handleLanguageCheck} /></div>)}
          </div>
        </div>
      </div>
    )
  }
}

class Topics extends React.Component {

  static propTypes = {
    topics: PropTypes.object.isRequired,
    introduction: PropTypes.string.isRequired,
    onChange: PropTypes.func
  }

  static suggestions = ['Schule / Ausbildung', 'Fotographie', 'Computerspiele', 'Sprachen', 'Kreatives', 'Technik',
    'Essen & Trinken', 'Kunst & Kultur', 'Sport', 'Familie', 'Bücher', 'Natur', 'Prominente',
    'Musik', 'Reisen', 'Politik', 'Filme & Serien', 'Typisch Deutsch']

  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate

  handleCheck = (topics) => {
    if (this.props.onChange) this.props.onChange({topics})
  }

  handleIntroductionChage = (e) => {
    const introduction = e.target.value
    if (this.props.onChange) this.props.onChange({introduction})
  }

  render () {
    const {topics, introduction} = this.props

    const leftovers = {...topics}
    Topics.suggestions.forEach((suggestion) => delete leftovers[suggestion])

    return (
      <div style={{display: 'flex', flexWrap: 'wrap', marginTop: 20}}>
        <div style={{fontSize: 15, fontWeight: 700, marginBottom: 8, marginRight: 10, flex: '0 0 150px'}}>
          Themen
        </div>
        <div style={{flex: '1 1 400px'}}>
          <div style={{marginBottom: 8, fontWeight: 700, fontSize: 14}}>Ich spreche gern über...</div>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {[...Topics.suggestions, ...Object.keys(leftovers)].map((topic) =>
              <div key={topic} style={{flex: '0 0 250px', margin: '4px 0'}}><ValuedCheckbox values={topics} selector={topic} onCheck={this.handleCheck} /></div>)}
          </div>
          <div style={{maxWidth: 450}}>
            <TextField value={introduction} style={{marginTop: -8}} fullWidth multiLine floatingLabelText='Ein Paar Worte über dich' rows={1} rowsMax={8} onChange={this.handleIntroductionChage} />
          </div>
        </div>
      </div>
    )
  }
}

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
    return <Checkbox checked={!!values[selector]} label={selector} onCheck={this.handleCheck} />
  }
}

class ProfilePage extends React.Component {

  static propTypes = {
    user: React.PropTypes.object.isRequired,
    saveProfile: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    const {profile} = this.props.user

    this.state = {
      picture: profile.picture,
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
    const gr = `https://secure.gravatar.com/avatar/${hash}?s=256&d=monsterid&r=x`
    return gr
  })()

  handleSave = async (e) => {
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

  handleBack = (e) => {
    this.props.push('/')
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

  render () {
    const {name, picture, topics, languages, inGermanySince, germanLevel, introduction} = this.state
    const {role} = this.props.user.profile
    const roleValid = role === 'student' || role === 'teacher'

    return (
      <div style={{margin: 16}}>
        <h1>Profil</h1>
        <div>

          {!roleValid ? (
            <TimeToChoose />
          ) : (
            <div>

              <div style={{display: 'flex', flexWrap: 'wrap', maxWidth: 630}}>
                <div style={{fontSize: 15, fontWeight: 700, marginBottom: 8, marginRight: 10, flex: '0 0 150px'}}>
                  Personendaten
                </div>
                <div style={{flex: '1 1 400px'}}>
                  <div style={{marginTop: -14}}>
                    <TextField fullWidth floatingLabelText='Name' value={name} onChange={this.handleNameChange} />
                  </div>
                  <div style={{marginTop: 16, marginBottom: 8, fontWeight: 700, fontSize: 14}}>Profilbild</div>
                  <div style={{display: 'flex'}}>
                    <Dropzone accept='image/*' style={{cursor: 'pointer', flex: '0 0 auto', margin: 5, padding: 5}} activeStyle={{backgroundColor: '#eee'}} onDrop={this.handleDrop}>
                      <div>
                        <img style={{borderRadius: '50%', width: 128, height: 128}} src={picture} />
                      </div>
                      <div style={{textAlign: 'center'}}>
                        <a href='#' onClick={this.cancel}>Hochladen</a>
                      </div>
                    </Dropzone>
                    <div style={{margin: 10}}>
                      <div style={{marginBottom: 10}}>
                        Wähle einen Avatar:
                      </div>
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

              <Languages role={role} languages={languages} inGermanySince={inGermanySince} germanLevel={germanLevel} onChange={this.handleChange} />
              <Topics topics={topics} introduction={introduction} onChange={this.handleChange} />

              <div style={{marginTop: 20, maxWidth: 630, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <FlatButton style={{margin: '0 10px'}} label='Zurück' onClick={this.handleBack} />
                <RaisedButton style={{margin: '0 10px'}} label='Speichern' primary onClick={this.handleSave} />
              </div>
            </div>
          )}

        </div>

      </div>
    )
  }

}

class ProfileOrLoading extends React.Component {
  static propTypes = {
    user: React.PropTypes.object
  }

  render () {
    if (this.props.user) return <ProfilePage {...this.props} />
    else return <div>Just a sec...</div>
  }
}

export default connect((state, props) => {
  const user = state.profile.profile
  return {user}
}, {saveProfile, push})(ProfileOrLoading)
