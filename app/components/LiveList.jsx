import React, {Component} from "react";
import {branch} from "baobab-react/decorators";

import styles from "./LiveList.css";
import SystemItem from "./SystemItem";
import AddAddressOne from "./AddAddressOne";


@branch({
  cursors: {
    live: ["live"]
  }
})
class LiveList extends Component {
  render() {
    return (
      <div>
        <p className={styles.level}>
          We are currently at level {this.props.live.level}
        </p>
        <ol>
          {this.props.live.systems.map(function(system) {
            return <li><SystemItem {...system}></SystemItem></li>;
          })}
        </ol>
        <AddAddressOne></AddAddressOne>
      </div>
    );

  }
}

export default LiveList;
