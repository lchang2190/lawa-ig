import React from 'react';
import { Container } from 'semantic-ui-react';

const FeedBar = (props) => (
  <div className="ui left aligned selection list">
    <div className="item">
      <img className="ui avatar image" src={props.loggedInUser.prof_pic}/>
      <div className="content">
        <div className="header">{props.loggedInUser.name}</div>
      </div>
    </div>
  </div>
)

export default FeedBar