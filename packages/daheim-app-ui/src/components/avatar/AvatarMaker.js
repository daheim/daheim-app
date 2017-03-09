import React, {Component, PropTypes} from 'react'
import styled from 'styled-components'

import {H2, Flex, HSpace, VSpace, Desktop, Mobile} from '../Basic'
import {Layout, Padding, Color} from '../../styles'

import dataf from './dataf'
import datam from './datam'

const colors = {
  1: {color: '#E61C78'},
  2: {color: '#7B3655'},
  3: {color: '#A2D7E4'},
  4: {color: '#5CB990'},
  5: {color: '#F5C62E'}
}

const skinColors = {
  1: {color: '#FFFFFF'},
  2: {color: '#ffdbac'},
  3: {color: '#f1c27d'},
  4: {color: '#e0ac69'},
  5: {color: '#c68642'},
  6: {color: '#8d5524'},
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

const ArrowBox = styled.div`
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  width: 100px;
  padding: 2px;
  background: ${Color.lightBlue};
  border-radius: 6px;
`

const Arrow = styled.img`
  cursor: pointer;
  width: 26px;
  height: 100%;
  filter: brightness(10);
  ${p => p.mirrored ? 'transform: scale(-1, 1);' : ''}
`

const Space = styled.div`
  cursor: pointer;
  height: 100%;
  flex: 1;
`

const Sep = styled.div`
  width: 2px;
  height: 75%;
  background: white;
`

class Slider extends Component {
  static propTypes = {
    onSlide: PropTypes.func,
    label: PropTypes.string,
  }

  forward = () => this.props.onSlide(1)
  backwards = () => this.props.onSlide(-1)

  render() {
    const {label} = this.props
    return (
      <Flex align='center'>
        <ArrowBox>
          <Arrow mirrored src='/icons/Icons_ready-12.svg' onClick={this.backwards}/>
          <Space onClick={this.backwards}/>
          <Sep/>
          <Space onClick={this.forward}/>
          <Arrow src='/icons/Icons_ready-12.svg' onClick={this.forward}/>
        </ArrowBox>
        <HSpace v={Padding.grid}/>
        <H2 style={{fontWeight: 'normal'}}>{label}</H2>
      </Flex>
    )
  }
}

function createAvatar(def, data) {
  let result = '<svg xmlns="http://www.w3.org/2000/svg" width="65mm" height="65mm" viewBox="0 0 184.25 184.25">'
  result += '<defs><style>'
  result += `.skin{fill:${skinColors[def.skinColor || 1].color}}`
  result += `.shirt{fill:${colors[def.shirtColor || 4].color}}`
  result += `.hair{fill:${colors[def.hairColor || 2].color}}`
  result += `.band{fill:${colors[def.bandColor || 2].color}}`
  result += `.hijab{fill:${colors[def.hijabColor || 2].color}}`
  result += `.glasses{stroke:${colors[def.glassesColor || 2].color};fill:${colors[def.glassesColor || 2].color}}`

  result += '</style>'
  result += data.face[def.face || 2].defs
  result += '</defs>'

  result += data.bg.svg
  result += data.shirt.svg

  result += data.face[def.face || 2].svg
  result += data.hair[def.hair || 1].svg
  result += data.beard[def.beard || 1].svg
  result += data.glasses[def.glasses || 2].svg

  result += '</svg>'

  return result.replace(/#/g, '%23')
}

const defaultDef = {
  shirtColor: 3,
  hair: 1,
  hairColor: 2,
  bandColor: 1,
  hijabColor: 1,
  face: 1,
  glasses: 1,
  glassesColor: 1,
  skinColor: 1,
  beard: 1,
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: ${Layout.mobileBreakpoint}) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`

export default class AvatarMakerPage extends Component {

  state = {
    svg: this.props.initialSvg || `data:image/svg+xml,${createAvatar(defaultDef, this.data)}`,
    def: {...defaultDef}
  }

  get data() {
    return this.props.gender === 'm' ? datam : dataf
  }

  componentWillReceiveProps(props) {
    if (props.gender !== this.props.gender) {
      //this.setState({def: {...defaultDef}})
      this.handleChange({def: {...defaultDef}}, props.gender === 'm' ? datam : dataf)
    }
  }

  handleChange = ({def}, data) => {
    const svg = `data:image/svg+xml,${createAvatar(def, data || this.data)}`
    this.setState({def: def, svg: svg})
    this.props.onChange(svg)
  }

  handleHairChanged = (v) => {
    const data = this.data
    const n = mod(this.state.def.hair + (v - 1), Object.keys(data.hair).length)
    this.handleChange({def: {...this.state.def, hair: n + 1}})
  }

  handleFaceChanged = (v) => {
    const data = this.data
    const n = mod(this.state.def.face + (v - 1), Object.keys(data.face).length)
    this.handleChange({def: {...this.state.def, face: n + 1}})
  }

  handleHairColorChanged = (v) => {
    const n = mod(this.state.def.hairColor + (v - 1), Object.keys(colors).length)
    this.handleChange({def: {...this.state.def, hairColor: n + 1}})
  }

  handleGlassesChanged = (v) => {
    const n = mod(this.state.def.glassesColor + v, Object.keys(colors).length + 1)
    if (n === 0) {
      this.handleChange({def: {...this.state.def, glasses: 1, glassesColor: 0}})
    } else {
      this.handleChange({def: {...this.state.def, glasses: 2, glassesColor: n}})
    }
  }

  handleShirtColorChanged = (v) => {
    const n = mod(this.state.def.shirtColor + (v - 1), Object.keys(colors).length)
    this.handleChange({def: {...this.state.def, shirtColor: n + 1}})
  }

  handleSkinColorChanged = (v) => {
    const n = mod(this.state.def.skinColor + (v - 1), Object.keys(skinColors).length)
    this.handleChange({def: {...this.state.def, skinColor: n + 1}})
  }

  handleAccesoryColorChanged = (v) => {
    const n = mod(this.state.def.hijabColor + (v - 1), Object.keys(colors).length)
    this.handleChange({def: {...this.state.def, hijabColor: n + 1, bandColor: n + 1}})
  }
  
  handleBeardChanged = (v) => {
    const data = this.data
    const n = mod(this.state.def.beard + (v - 1), Object.keys(data.beard).length)
    this.handleChange({def: {...this.state.def, beard: n + 1}})
  }

  render () {
    const m = this.props.gender === 'm'
    return (
      <Container>
        <img src={this.state.svg} style={{borderRadius: '50%', height: 250}} />
        <Desktop><HSpace v='100px'/></Desktop>
        <Mobile><VSpace v='20px'/></Mobile>
        <div>
          <Slider label='Mund' onSlide={this.handleFaceChanged}/>
          <VSpace v={Padding.s}/>
          <Slider label='Brille' onSlide={this.handleGlassesChanged}/>
          <VSpace v={Padding.s}/>
          <Slider label='Hautfarbe' onSlide={this.handleSkinColorChanged}/>
          <VSpace v={Padding.s}/>
          <Slider label='Frisur' onSlide={this.handleHairChanged}/>
          <VSpace v={Padding.s}/>
          <Slider label='Haarfarbe' onSlide={this.handleHairColorChanged}/>
          <VSpace v={Padding.s}/>
          {m ? (
            <Slider label='Bart' onSlide={this.handleBeardChanged}/>
          ) : (
            <Slider label='Accesoirefarbe' onSlide={this.handleAccesoryColorChanged}/>
          )}
          <VSpace v={Padding.s}/>
          <Slider label='Shirt' onSlide={this.handleShirtColorChanged}/>
        </div>
      </Container>
    )
  }
}