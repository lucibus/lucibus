import React, {Component} from "react";
import {branch} from "baobab-react/decorators";
import PropTypes from "baobab-react/prop-types";

@branch({
  cursors: {
    level: ["live", "level"],
  }
})
class LiveLevel extends Component {
  static contextTypes = {
    tree: PropTypes.baobab,
    cursors: PropTypes.cursors
  }

  onChange(e) {
    var newValue = parseFloat(e.target.value);
    this.context.cursors.level.set(newValue);
    this.context.tree.commit();
  }

  render() {
    return (
      <p>
        <input type="range" min="0" max="1" step="0.01" value={this.props.level} onChange={this.onChange.bind(this)} />
      </p>
    );

  }
}

export default LiveLevel;
