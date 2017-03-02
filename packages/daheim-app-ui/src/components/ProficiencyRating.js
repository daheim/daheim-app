import React, {Component, PropTypes} from 'react'

import {Checkbox} from './Basic'

import {injectIntl} from 'react-intl'

export const levelToMessageId = (level) => {
  switch (level) {
    case 1: return 'profile.proficiencyA1';
    case 2: return 'profile.proficiencyA2';
    case 3: return 'profile.proficiencyB1';
    case 4: return 'profile.proficiencyB2';
    case 5: return 'profile.proficiencyC1';
  }
}

export const levelToString = (level) => {
  switch (level) {
    case 1: return 'A1';
    case 2: return 'A2';
    case 3: return 'B1';
    case 4: return 'B2';
    case 5: return 'C1';
  }
}

class ProficiencyRating extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    itemStyle: PropTypes.object,
    values: PropTypes.object,
    style: PropTypes.object,
    value: PropTypes.string
  }

  state = {
    values: null
  }

  constructor(props) {
    super(props)
    if (props.values == null) {
      const m = id => props.intl.formatMessage({id})
      this.state.values = {
        1: m(levelToMessageId(1)),
        2: m(levelToMessageId(2)),
        3: m(levelToMessageId(3)),
        4: m(levelToMessageId(4)),
        5: m(levelToMessageId(5)),
      }
    }
  }

  componentWillReceiveProps(props) {
    if (props.values) this.setState({values: props.values})
  }

  handleChange = (e) => {
    if (this.props.onChange) { this.props.onChange(e) }
  }

  render () {
    const value = this.props.value
    if (this.props.readOnly) {
      return <div style={this.props.itemStyle}>{this.state.values[value] || 'N/A'}</div>
    }

    const itemStyle = this.props.itemStyle || {margin: '8px 0'}

    return (
      <div style={this.props.style}>
        {Object.keys(this.state.values).map(key =>
          <Checkbox
            key={key}
            type='neutral'
            style={itemStyle}
            label={this.state.values[key]}
            checked={key === value}
            onCheck={() => this.handleChange({target: {value: key}})}
          />
        )}
      </div>
    )
  }
}

export default injectIntl(ProficiencyRating)