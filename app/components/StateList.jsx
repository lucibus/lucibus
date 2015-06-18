import React, {Component} from "react";
import {branch} from "baobab-react/decorators";

@branch({
  cursors: {
    state: ["state"],
  }
})
class StateList extends Component {
  render() {
    return (
      <span>
        We are currently at level {this.props.state.level}
      </span>
    );
  }
}


module.exports = StateList;
