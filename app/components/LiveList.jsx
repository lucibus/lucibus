import React, {Component} from "react";
import {branch} from "baobab-react/decorators";

import styles from "./LiveList.css";


@branch({
  cursors: {
    level: ["live", "level"],
  }
})
class LiveList extends Component {
  render() {
    return (
      <p className={styles.level}>
        We are currently at level {this.props.level}
      </p>
    );

  }
}

export default LiveList;
