import React, {Component, PropTypes} from 'react'
import Slider from 'material-ui/Slider'
import Checkbox from 'material-ui/Checkbox'

import data from './data'

class AvatarRender extends Component {

  createAvatar () {
    const def = this.props.def || {}

    let result = '<svg xmlns="http://www.w3.org/2000/svg" width="65mm" height="65mm" viewBox="0 0 184.25 184.25">'
    result += '<defs><style>'
    result += `.shirt{fill:${data.colors[def.shirtColor || 4].color}}`
    result += `.hair{fill:${data.colors[def.hairColor || 2].color}}`
    result += `.band{fill:${data.colors[def.bandColor || 2].color}}`
    result += `.hijab{fill:${data.colors[def.hijabColor || 2].color}}`
    result += `.glasses{stroke:${data.colors[def.glassesColor || 2].color}}`

    result += '</style>'
    result += data.face[def.face || 2].defs
    result += '</defs>'

    result += data.bg.svg
    result += data.shirt.svg

    result += data.face[def.face || 2].svg
    result += data.hair[def.hair || 1].svg
    result += data.glasses[def.glasses || 2].svg

    result += '</svg>'

    return result
  }


  render () {
    const imagedata = this.createAvatar()
    const uri = new Buffer(imagedata).toString('base64')

    return <img src={`data:image/svg+xml,${imagedata}`} style={{borderRadius: '50%'}} />
  }
}

export default class AvatarMakerPage extends Component {

  state = {
    def: {
      shirtColor: Math.floor(Math.random() * Object.keys(data.colors).length) + 1,
      hair: Math.floor(Math.random() * Object.keys(data.hair).length) + 1,
      hairColor: Math.floor(Math.random() * Object.keys(data.colors).length) + 1,
      bandColor: Math.floor(Math.random() * Object.keys(data.colors).length) + 1,
      hijabColor: Math.floor(Math.random() * Object.keys(data.colors).length) + 1,
      face: Math.floor(Math.random() * Object.keys(data.face).length) + 1,
      glasses: Math.floor(Math.random() * Object.keys(data.glasses).length) + 1,
      glassesColor: Math.floor(Math.random() * Object.keys(data.colors).length) + 1,
    }
  }

  handleHairChanged = (e, value) => {
    this.setState({def: {...this.state.def, hair: value}})
  }

  handleFaceChanged = (e, value) => {
    this.setState({def: {...this.state.def, face: value}})
  }

  handleHairColorChanged = (e, value) => {
    this.setState({def: {...this.state.def, hairColor: value}})
  }

  handleBandColorChanged = (e, value) => {
    this.setState({def: {...this.state.def, bandColor: value}})
  }

  handleHijabColorChanged = (e, value) => {
    this.setState({def: {...this.state.def, hijabColor: value}})
  }

  handleGlassesChanged = (e, checked) => {
    this.setState({def: {...this.state.def, glasses: checked ? 2 : 1}})
  }

  handleGlassesColorChanged = (e, value) => {
    this.setState({def: {...this.state.def, glassesColor: value}})
  }

  handleShirtColorChanged = (e, value) => {
    this.setState({def: {...this.state.def, shirtColor: value}})
  }

  render () {
    const hairdata = data.hair[this.state.def.hair]

    return (
      <div style={{display: 'flex'}}>
        <div><AvatarRender def={this.state.def} /></div>
        <div style={{margin: 20, flex: '0 0 300px', minHeight: 600}}>
          Shirt:
          <Slider value={this.state.def.shirtColor} min={1} max={Object.keys(data.colors).length} step={1} onChange={this.handleShirtColorChanged} />
          Hair:
          <Slider value={this.state.def.hair} min={1} max={Object.keys(data.hair).length} step={1} onChange={this.handleHairChanged} />
          {hairdata.hair ? <Slider value={this.state.def.hairColor} min={1} max={Object.keys(data.colors).length} step={1} onChange={this.handleHairColorChanged} /> : null}
          {hairdata.band ? <Slider value={this.state.def.bandColor} min={1} max={Object.keys(data.colors).length} step={1} onChange={this.handleBandColorChanged} /> : null}
          {hairdata.hijab ? <Slider value={this.state.def.hijabColor} min={1} max={Object.keys(data.colors).length} step={1} onChange={this.handleHijabColorChanged} /> : null}
          Face:
          <Slider value={this.state.def.face} min={1} max={Object.keys(data.face).length} step={1} onChange={this.handleFaceChanged} />
          <Checkbox label='Glasses' checked={this.state.def.glasses === 2} onCheck={this.handleGlassesChanged} />
          {this.state.def.glasses === 2 ? <Slider value={this.state.def.glassesColor} min={1} max={Object.keys(data.colors).length} step={1} onChange={this.handleGlassesColorChanged} /> : null}
        </div>
      </div>
    )
  }
}
