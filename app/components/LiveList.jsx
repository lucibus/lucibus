import React, {Component} from "react";
import {branch} from "baobab-react/decorators";

import styles from "./LiveList.css";
import SystemItem from "./SystemItem"


@branch({
  cursors: {
    live: ["live"]
  }
})
class LiveList extends Component {
  render() {
    return (
      <div className={styles.level}>
        <p className={styles.level}>
          We are currently at level {this.props.live.level}
        </p>
        <ol>
          {this.props.live.systems.map(function(system) {
            return <li><SystemItem {...system}></SystemItem></li>;
          })}
        </ol>
      </div>
    );

  }
}

export default LiveList;
