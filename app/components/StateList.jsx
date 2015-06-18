import React, {Component} from "react";
import {branch} from "baobab-react/decorators";

import styles from "./StateList.css";


@branch({
  cursors: {
    state: ["state"],
  }
})
class StateList extends Component {
  render() {
    return (
      <span className={styles.stateList}>
        We are currently at level {this.props.state.level}
      </span>
    );

  }
}

export default StateList;
