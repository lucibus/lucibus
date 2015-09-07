/*eslint-disable react/prop-types */
import {Component} from 'react'
import {Cerebral} from 'common/utils'

const REFRESH_INTERVAL = 30

export default @Cerebral({})
class Now extends Component {

  stop = false

  refresh () {
    // this.props.signals.timePassed()

    if (!this.stop) {
      this.refreshInFuture()
    }
  }

  refreshInFuture () {
    setTimeout(this.refresh.bind(this), REFRESH_INTERVAL)
  }

  componentDidMount () {
    this.refreshInFuture()
  }

  componentWillUnmount () {
    this.stop = true
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return null
  }
}
