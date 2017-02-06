import React, {Component, PropTypes} from 'react'
import styled from 'styled-components'

import {Padding, Fontsize, Color} from '../styles'

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
    onClick: PropTypes.object,
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
    onClick: PropTypes.object,
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
  font-size: ${Fontsize.m};
  color: ${p => p.red ? Color.red : Color.black};
`

const Input = styled.input`
  height: 33px;
  width: 100%;
  padding-left: 5px;
  color: ${Color.lightGreen};
  border-radius: 6px;
  border: 2.666px solid ${Color.lightGreen};
  font-weight: 700;
  font-size: ${Fontsize.l};
`

export class TextField extends Component {
  static propTypes = {
    innerRef: PropTypes.func,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const {label, error} = this.props
    return (
      <div>
        <Label red={error}>{error ? error : label}</Label>
        <VSpace v={Padding.s}/>
        <Input
          innerRef={this.props.innerRef}
          value={this.props.value}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder}
          type={this.props.type}
        />
      </div>
    )
  }
}

const CheckboxContainer = styled.div`
  cursor: pointer;
  position: relative;
  overflow: visible;
  display: table;
  height: auto;
  width: 100%;
`

const CheckboxBox = styled.div`
  border-radius: 6px;
  border: 2.666px solid ${Color.lightGreen};
  width: 25px;
  height: 25px;
  background: ${p => p.checked ? `url('/icons/Icons_ready-30.svg')` : 'none'};
`

export class Checkbox extends Component {
  static propTypes = {
    innerRef: PropTypes.func,
    label: PropTypes.string,
    style: PropTypes.object,
    checked: PropTypes.bool.isRequired,
    onCheck: PropTypes.func.isRequired,
  }

  handleChange = (e) => {
    this.props.onCheck(e)
  }

  render() {
    const {label, error} = this.props
    return (
      <CheckboxContainer style={this.props.style}>
        <input
          ref={this.props.innerRef}
          type='checkbox'
          style={{position: 'absolute', opacity: 0, zIndex: -2}}
          checked={this.props.checked}
          onChange={this.handleChange}
        />
        <Flex onClick={() => this.handleChange({target: {checked: !this.props.checked}})}>
          <CheckboxBox checked={this.props.checked}/>
          <HSpace v='12px'/>
          <span style={{fontSize: Fontsize.m}}>{this.props.label}</span>
        </Flex>
      </CheckboxContainer>
    )
  }
}

export const Button = styled.button`
  cursor: pointer;
  display: block;
  width: 220px;
  height: 30.641px;
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