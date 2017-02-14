import React, {Component, PropTypes} from 'react'

import {Checkbox} from './Basic'

import {injectIntl} from 'react-intl'

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
        1: m('profile.proficiencyA1'),
        2: m('profile.proficiencyA2'),
        3: m('profile.proficiencyB1'),
        4: m('profile.proficiencyB2'),
        5: m('profile.proficiencyC1'),
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