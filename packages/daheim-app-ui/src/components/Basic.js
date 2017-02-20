import React, {Component, PropTypes} from 'react'
import styled from 'styled-components'

import {Layout, Padding, Fontsize, Color} from '../styles'

export class HSpace extends Component {
  static propTypes = { v: PropTypes.string.isRequired }
  render() { return <div style={{ marginRight: this.props.v }}/> }
}
export class VSpace extends Component {
  static propTypes = { v: PropTypes.string.isRequired }
  render() { return <div style={{ marginBottom: this.props.v }}/> }
}

export class Flex extends Component {
  static propTypes = {
    align: PropTypes.string,
    justify: PropTypes.string,
    wrap: PropTypes.bool,
    column: PropTypes.bool,
    auto: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func,
  }

  render() {
    const {children, align, justify, wrap, column, auto, style} = this.props
    const s = {display: 'flex'}
    if (align != null) s['alignItems'] = align
    if (justify != null) s['justifyContent'] = justify
    if (wrap) s['flexWrap'] = 'wrap'
    if (column) s['flexDirection'] = 'column'
    if (auto) s['flex'] = '1 1 auto'
    if (style) Object.assign(s, style)
    return <div style={s} onClick={this.props.onClick}>{children}</div>
  }
}
export class Box extends Component {
  static propTypes = {
    align: PropTypes.string,
    justify: PropTypes.string,
    wrap: PropTypes.bool,
    column: PropTypes.bool,
    auto: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func,
  }

  render() {
    const {children, align, justify, wrap, column, auto, style} = this.props
    const s = {}
    if (align != null) s['alignItems'] = align
    if (justify != null) s['justifyContent'] = justify
    if (wrap) s['flexWrap'] = 'wrap'
    if (column) s['flexDirection'] = 'column'
    if (auto) s['flex'] = '1 1 auto'
    if (style) Object.assign(s, style)
    return <div style={s} onClick={this.props.onClick}>{children}</div>
  }
}

const Label = styled.div`
  font-size: ${p => p.big ? Fontsize.l : Fontsize.m};
  font-weight: ${p => p.big ? 'bold' : 'normal'};
  color: ${p => p.red ? Color.red : Color.black};
`

const Input = styled.input`
  height: ${p => p.small ? 'auto' : '33px'};
  width: 100%;
  padding-left: 5px;
  color: ${p => p.neutral ? Color.lightBlue : Color.lightGreen};
  border-radius: 6px;
  border: 2.666px solid ${p => p.neutral ? Color.lightBlue : Color.lightGreen};
  font-weight: ${p => p.small ? 'normal' : 'bold'};
  font-size: ${p => p.small ? Fontsize.m : Fontsize.l};
`

export class TextField extends Component {
  static propTypes = {
    innerRef: PropTypes.func,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    bigLabel: PropTypes.bool,
    small: PropTypes.bool,
    neutral: PropTypes.bool,
    readOnly: PropTypes.bool,
    label: PropTypes.string,
    error: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  }

  render() {
    const {bigLabel, label, error} = this.props
    return (
      <div>
        <Label big={bigLabel} red={error}>{error ? error : label}</Label>
        <VSpace v={Padding.s}/>
        <Input
          innerRef={this.props.innerRef}
          small={this.props.small}
          neutral={this.props.neutral}
          readOnly={this.props.readOnly}
          value={this.props.value}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder}
          type={this.props.type}
        />
      </div>
    )
  }
}

export const H1 = styled.div`
  font-size: ${Fontsize.xl};
  font-weight: bold;
  font-family: 'Rambla';
`

export const H2 = styled.div`
  font-size: ${Fontsize.l};
  font-weight: bold;
  font-family: 'Rambla';
`

export const H3 = styled.div`
  font-size: ${Fontsize.m};
  font-weight: bold;
  font-family: 'Rambla';
`

export const Text = styled.div`
  font-size: ${Fontsize.m};
  font-weight: normal;
  font-family: 'Rambla';
`

export const Mobile = styled.div`
  display: none;
  @media (max-width: ${Layout.mobileBreakpoint}) {
    display: block;
  }
`

export const Desktop = styled.div`
  display: none;
  @media (min-width: ${Layout.mobileBreakpointPx + 1}px) {
    display: block;
  }
`

const CheckboxContainer = styled.div`
  cursor: pointer;
  position: relative;
  overflow: visible;
  display: table;
  height: auto;
`

const CheckboxBox = styled.div`
  border-radius: 4px;
  border: 2.666px solid ${p => p.borderColor || Color.lightGreen};
  width: 25px;
  height: 25px;
  flex-grow: 0;
  flex-shrink: 0;
  background: ${p => p.bg || 'none'};
`

export class Checkbox extends Component {
  static propTypes = {
    innerRef: PropTypes.func,
    label: PropTypes.string,
    type: PropTypes.string,
    style: PropTypes.object,
    checked: PropTypes.bool.isRequired,
    onCheck: PropTypes.func.isRequired,
  }

  handleChange = (e) => {
    this.props.onCheck(e, e.target.checked)
  }

  render() {
    const {checked, type, label, children} = this.props
    const bg = type === 'neutral' && this.props.checked ? Color.lightBlue : 'none'
    const filter = type === 'neutral' ? 'brightness(100)' : 'none'
    const border = type === 'neutral' ? Color.lightBlue : Color.lightGreen
    return (
      <CheckboxContainer style={this.props.style}>
        <input
          ref={this.props.innerRef}
          type='checkbox'
          style={{position: 'absolute', opacity: 0, zIndex: -2}}
          checked={this.props.checked}
          onChange={this.handleChange}
        />
        <Flex align='center' onClick={() => this.handleChange({target: {checked: !checked}})}>
          <CheckboxBox bg={bg} borderColor={border}>
            {checked &&
              <img
                style={{height: '100%', filter: filter, objectFit: 'contain'}}
                src='/icons/Icons_ready-30.svg'
              />
            }
          </CheckboxBox>
          <HSpace v='12px'/>
          <span style={{fontSize: Fontsize.m}}>{label || children}</span>
        </Flex>
      </CheckboxContainer>
    )
  }
}

export const Button = styled.button`
  cursor: pointer;
  display: block;
  width: 220px;
  color: white;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  font-family: 'Rambla', sans-serif;
  background: ${p => p.primary ? Color.lightGreen : p.neg ? Color.red : Color.lightBlue};
  border: none;
  border-radius: 6px;
  
  &:hover {
    background: ${p => p.primary ? Color.green : p.neg ? Color.darkRed : Color.blue};
  }
`

const DropDownSelect = styled.select`
  font-size: ${Fontsize.l};
  font-weight: bold;
  font-family: 'Rambla';
  text-align: center;
  background: white;
  border: 2.666px solid ${Color.lightBlue};
  border-radius: 4px;
  color: ${Color.lightBlue};
`

export class DropDownMenu extends Component {
  static propTypes = {
    items: PropTypes.array,
    selected: PropTypes.any,
    onSelect: PropTypes.func,
  }

  handleSelect = (e) => {
    for (const item of this.props.items) {
      if (item.label === e.target.value) {
        this.props.onSelect(item)
        break
      }
    }
  }

  render() {
    const items = this.props.items
    const selected = this.props.selected
    return (
      <DropDownSelect
        value={selected.label}
        onChange={this.handleSelect}
        >
        {items.map(item =>
          <option
            key={item.label}
            value={item.label}
          >{item.label}</option>
        )}
      </DropDownSelect>
    )
  }
}

export const InterestType = {
  school: 'school',
  photography: 'photography',
  games: 'games',
  languages: 'languages',
  creative: 'creative',
  tech: 'tech',
  food: 'food',
  culture: 'culture',
  sports: 'sports',
  books: 'books',
  nature: 'nature',
  celebs: 'celebs',
  music: 'music',
  travel: 'travel',
  politics: 'politics',
  tv: 'tv',
  german: 'german',
  work: 'work',
}

const InterestBox = styled.div`
  display: flex;
  height: 25px;
  padding: 1px 5px;
  border: 2px solid ${Color.lightBlue};
  border-radius: 4px;
  font-weight: bold;
  font-size: ${Fontsize.m};
  color: ${Color.lightBlue};
`

const InterestImg = styled.img`
  height: 100%;
  margin-right: 3px;
  object-fit: contain;
  filter: hue-rotate(150deg);
`

export const Interest = ({interest}) => {
  let icon
  let text
  switch (interest) {
    case InterestType.school:
      icon = '03'
      text = 'Schule / Ausbildung'
      break
    case InterestType.photography:
      icon = '05'
      text = 'Fotografie'
      break
    case InterestType.games:
      icon = '06'
      text = 'Computerspiele'
      break
    case InterestType.languages:
      icon = '07'
      text = 'Sprachen'
      break
    case InterestType.creative:
      icon = '08'
      text = 'Kreatives'
      break
    case InterestType.tech:
      icon = '09'
      text = 'Technik'
      break
    case InterestType.food:
      icon = '11'
      text = 'Essen & Trinken'
      break
    case InterestType.culture:
      icon = '10'
      text = 'Kunst & Kultur'
      break
    case InterestType.sports:
      icon = '15'
      text = 'Sport'
      break
    case InterestType.books:
      icon = '16'
      text = 'Books'
      break
    case InterestType.nature:
      icon = '17'
      text = 'Natur'
      break
    case InterestType.celebs:
      icon = '18'
      text = 'Prominente'
      break
    case InterestType.music:
      icon = '20'
      text = 'Musik'
      break
    case InterestType.travel:
      icon = '22'
      text = 'Reisen'
      break
    case InterestType.politics:
      icon = '19'
      text = 'Politik'
      break
    case InterestType.tv:
      icon = '24'
      text = 'Filme & Serien'
      break
    case InterestType.german:
      icon = '23'
      text = 'Typisch Deutsch'
      break
    case InterestType.work:
      icon = '21'
      text = 'Job / Arbeit'
      break
  }
  return (
    <InterestBox>
      <InterestImg src={`/icons/Icons_ready-${icon}.svg`}/>
      {text}
    </InterestBox>
  )
}

export const Avatar = styled.img`
  width: ${p => p.size || 'auto'};
  height: ${p => p.size || '100%'};
  border-radius: 50%;
`

export class CircularProgress extends Component {
  static propTypes = {
    size: PropTypes.number,
  }

  render() {
    const {size} = this.props
    return (
      <div className='loader' style={{transform: `scale(${size})`}}/>
    )
  }
}