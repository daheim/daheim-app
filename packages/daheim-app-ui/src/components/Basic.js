import React, {Component, PropTypes} from 'react'
import styled from 'styled-components'

import {Padding, Fontsize, Color} from '../styles'

export class HSpace extends Component {
  static propTypes = { v: PropTypes.string.isRequired }
  render() { return <div style={{ marginRight: this.props.v }}/> }
}
export class VSpace extends Component {
  render() { return <div style={{ marginBottom: this.props.v }}/> }
}

export class Flex extends Component {
  // static propTypes = {
  //   align: PropTypes.string,
  //   justify: PropTypes.string,
  //   wrap: PropTypes.boolean,
  //   column: PropTypes.boolean,
  //   auto: PropTypes.boolean,
  // }

  render() {
    const {children, align, justify, wrap, column, auto, style} = this.props
    const s = {display: 'flex'}
    if (align != null) s['alignItems'] = align
    if (justify != null) s['justifyContent'] = justify
    if (wrap) s['flexWrap'] = 'wrap'
    if (column) s['flexDirection'] = 'column'
    if (auto) s['flex'] = '1 1 auto'
    if (style) Object.assign(s, style)
    return <div style={s}>{children}</div>
  }
}
export class Box extends Component {
  // static propTypes = {
  //   align: PropTypes.string,
  //   justify: PropTypes.string,
  //   wrap: PropTypes.boolean,
  //   column: PropTypes.boolean,
  //   auto: PropTypes.boolean,
  // }

  render() {
    const {children, align, justify, wrap, column, auto, style} = this.props
    const s = {}
    if (align != null) s['alignItems'] = align
    if (justify != null) s['justifyContent'] = justify
    if (wrap) s['flexWrap'] = 'wrap'
    if (column) s['flexDirection'] = 'column'
    if (auto) s['flex'] = '1 1 auto'
    if (style) Object.assign(s, style)
    return <div style={s}>{children}</div>
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

export const Button = styled.button`
  display: block;
  width: 191px;
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