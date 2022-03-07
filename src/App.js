import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)
    window.App = this

  }

  componentDidMount() {
    this.setState({ test: '123' })
  }

  render() {
    return (
      <>
        <h1>Hello World</h1>
      </>
    )
  }
}

export default App