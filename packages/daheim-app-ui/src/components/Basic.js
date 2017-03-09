import React, {Component, PropTypes} from 'react'
import {VelocityTransitionGroup} from 'velocity-react'
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
  font-family: 'Rambla';
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
    const {value, bigLabel, label, error} = this.props
    return (
      <div>
          <VelocityTransitionGroup
            enter={{animation: 'slideDown', duration: 100}}
            leave={{animation: 'slideUp', duration: 100}}
            >
            {(error || (value && label)) &&
              <div>
                <Label big={bigLabel} red={error}>{error ? error : label}</Label>
                <VSpace v={Padding.s}/>
              </div>
            }
          </VelocityTransitionGroup>
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

export const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  color: ${Color.lightBlue};
  border: 2.666px solid ${Color.lightBlue};
  border-radius: 4px;
  font-size: ${Fontsize.m};
  font-family: 'Rambla';
  padding: 4px;
`

export const H1 = styled.div`
  font-size: ${Fontsize.xl};
  font-weight: bold;
  font-family: 'Rambla';
`

export const H2 = styled.div`
  font-size: ${Fontsize.l};
  font-weight: ${p => p.normal ? 'normal' : 'bold'};
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
        <Flex align='flex-start' onClick={() => this.handleChange({target: {checked: !checked}})}>
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
  border-radius: 6px;
  color: ${Color.lightBlue};
`

const DropDownOverlay = styled.div`
  position: absolute;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  font-size: ${Fontsize.l};
  font-weight: bold;
  font-family: 'Rambla';
  text-align: center;
  background: white;
  border: 2.666px solid ${Color.lightBlue};
  border-radius: 6px;
  color: ${Color.lightBlue};
`

const DropDownContainer = styled.div`
  position: relative;
  display: inline-block;
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
      <DropDownContainer>
        <DropDownOverlay>
          <span>{selected.label}</span>
          <span style={{position: 'absolute', right: 7}}>▾</span>
        </DropDownOverlay>
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
      </DropDownContainer>
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
  filter: hue-rotate(50deg);
`

export const Interest = ({interest, ...rest}) => {
  let icon
  let text
  switch (interest) {
    case InterestType.school:
    case 'Schule / Ausbildung':
      icon = '03'
      text = 'Schule / Ausbildung'
      break
    case InterestType.photography:
    case 'Fotografie':
      icon = '05'
      text = 'Fotografie'
      break
    case InterestType.games:
    case 'Computerspiele':
      icon = '06'
      text = 'Computerspiele'
      break
    case InterestType.languages:
    case 'Sprachen':
      icon = '07'
      text = 'Sprachen'
      break
    case InterestType.creative:
    case 'Kreatives':
      icon = '08'
      text = 'Kreatives'
      break
    case InterestType.tech:
    case 'Technik':
      icon = '09'
      text = 'Technik'
      break
    case InterestType.food:
    case 'Essen & Trinken':
      icon = '11'
      text = 'Essen & Trinken'
      break
    case InterestType.culture:
    case 'Kunst & Kultur':
      icon = '10'
      text = 'Kunst & Kultur'
      break
    case InterestType.sports:
    case 'Sport':
      icon = '15'
      text = 'Sport'
      break
    case InterestType.books:
    case 'Books':
      icon = '16'
      text = 'Books'
      break
    case InterestType.nature:
    case 'Natur':
      icon = '17'
      text = 'Natur'
      break
    case InterestType.celebs:
    case 'Prominente':
      icon = '18'
      text = 'Prominente'
      break
    case InterestType.music:
    case 'Musik':
      icon = '20'
      text = 'Musik'
      break
    case InterestType.travel:
    case 'Reisen':
      icon = '22'
      text = 'Reisen'
      break
    case InterestType.politics:
    case 'Politik':
      icon = '19'
      text = 'Politik'
      break
    case InterestType.tv:
    case 'Filme & Serien':
      icon = '24'
      text = 'Filme & Serien'
      break
    case InterestType.german:
    case 'Typisch Deutsch':
      icon = '23'
      text = 'Typisch Deutsch'
      break
    case InterestType.work:
    case 'Job / Arbeit':
      icon = '21'
      text = 'Job / Arbeit'
      break
    default:
      icon = null
      text = interest
      break
  }
  return (
    <InterestBox {...rest}>
      {icon && <InterestImg src={`/icons/Icons_ready-${icon}.svg`}/>}
      {text}
    </InterestBox>
  )
}

export const LanguageBox = styled(InterestBox)``

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

const SwitchBox = styled.div`
  display: flex;
  padding: 4px;
  border: 2px solid ${Color.lightBlue};
  border-radius: 6px;
`

const SwitchLabelContainer = styled(SwitchBox)`
  border-color: rgba(0,0,0,0);
  padding-top: 0;
  padding-bottom: 0;
`

const SwitchButton = styled.div`
  visibility: ${p => p.hide ? 'hidden' : 'visible'};
  background: ${Color.lightBlue};
  height: 20px;
  border-radius: 4px;
`

const SwitchLabel = styled(Text)`
  visibility: ${p => p.hide ? 'hidden' : 'visible'};
  padding: 2px 30px;
`

export class Switch extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    style: PropTypes.object,
    selected: PropTypes.number.isRequired,
    label0: PropTypes.string.isRequired,
    label1: PropTypes.string.isRequired,
    onSwitch: PropTypes.func.isRequired,
  }

  handleSwitch = () => {
    if (this.props.disabled) return
    this.props.onSwitch(!this.props.selected)
  }

  render() {
    const {style, disabled, selected, label0, label1} = this.props
    return (
      <Flex
        column
        style={{cursor: 'pointer', opacity: disabled ? 0.5 : 1, userSelect: 'none', ...style}}
        onClick={this.handleSwitch}
        >
        <SwitchLabelContainer>
          <SwitchLabel>{label0}</SwitchLabel>
          <Box auto/>
          <SwitchLabel>{label1}</SwitchLabel>
        </SwitchLabelContainer>
        <SwitchBox>
          <SwitchButton hide={selected !== 0}>
            <SwitchLabel hide>{label0}</SwitchLabel>
          </SwitchButton>
          <Box auto/>
          <SwitchButton hide={selected !== 1}>
            <SwitchLabel hide>{label1}</SwitchLabel>
          </SwitchButton>
        </SwitchBox>
      </Flex>
    )
  }
}