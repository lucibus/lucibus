import React, {Component} from "react";
import {branch} from "baobab-react/decorators";
import PropTypes from "baobab-react/prop-types";

@branch({
  cursors: {
    systems: ["live", "systems"]
  }
})
class AddDimmer extends Component {
  static contextTypes = {
    tree: PropTypes.baobab,
    cursors: PropTypes.cursors
  }

  handleClick() {
    this.context.cursors.systems.push({
      "type": "filter",
      "level": 1,
      "specifiers": {
        "address": 1
      }
    });
    this.context.tree.commit();
  }

  render() {
    return (
      <p onClick={this.handleClick.bind(this)}>
        Click to add address 1 to the stack.
      </p>
    );

  }
}

export default AddDimmer;
