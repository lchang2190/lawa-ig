import React from 'react';
import { Grid } from 'semantic-ui-react';
import OneFeed from './feed.jsx';

const FeedGrid = (props) => (

  <div className="feed-grid-container">
    <Grid centered columns={1}>
      {
        props.userFeeds.map((feed, index) => {
            return <OneFeed loggedInUser={props.loggedInUser} name={feed.name} post={feed.post_id} img={feed.img} likes={feed.like_count} caption={feed.caption} key={index}/>;
        })
      }
    </Grid>
  </div>
    
);

export default FeedGrid;