import React from 'react'

export default class Weather extends React.Component {
  render () {
    return <iframe type='text/html' frameBorder='0' height='245' width='100%' src='https://forecast.io/embed/#lat=51.064702&lon=10.656738&name=Deutschland&units=ca' />
  }
}

