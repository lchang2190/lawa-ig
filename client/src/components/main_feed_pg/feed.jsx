import React from 'react';
import { Comment, Image} from 'semantic-ui-react';
import FeedGrid from './feed_grid.jsx';
import Comments from './comment.jsx';
import axios from 'axios';

class OneFeed extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			comments: [],
			liked: false,
			postLikes: []
		}
	}

	componentDidMount() {
		this.loadComments(this.props.post);
	}

	getLikesOnPost() {
    var bodyObj = {postId: this.props.post.post_id};
    bodyObj.status = 'getAllLikes';

    var postConfig = {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(bodyObj)
    };

    fetch('/like', postConfig)
      .then(data => data.json())
      .then(jsonData => {
        this.setState({postLikes: jsonData.rows});
      });
  }

	loadComments(postId) {
		console.log(postId);
		axios.post('/comments', {postId: postId})
			.then((response) => {
				this.setState({
					comments: response.data
				})
			})
			.catch((error) => {
				console.log('axios load comment error', error)
			})
	}

	changeLikesLive (likerObj, addOrRm) {
    var postLikes = this.state.postLikes;
    if (addOrRm === 'add') {
      postLikes.push(likerObj);
      this.setState({postLikes: postLikes});
    } else {
      postLikes = postLikes.filter(like => likerObj.user_id !== like.user_id);
      this.setState({postLikes: postLikes});
    }
  }

	liveUpdateLike() {
    // let { postLikes } = this.state;

    let likerObj = {
      user_id: this.props.loggedInUser.user_id,
      name: this.props.loggedInUser.name,
      prof_pic: this.props.loggedInUser.prof_pic
    };

    if (this.state.liked) {
      this.changeLikesLive(likerObj, 'rm');        
    } else {
      this.changeLikesLive(likerObj, 'add');
    }
  }

	toggleLike() {
    //PUSH picture data into logged in user's liked photos
    console.log(this.props.loggedInUser);
    console.log(this.props.post);
    var bodyObj = {userId: this.props.loggedInUser.user_id, postId: this.props.post};

    bodyObj.status = this.state.liked ? 'rmLike' : 'addLike';

    var postConfig = {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(bodyObj)
    };

    fetch('/like', postConfig);
    this.liveUpdateLike();
    this.setState({liked: !this.state.liked});
	}

	render () {
		return (
			<div className="ui card">
			  <div className="content">
			    <img className="ui avatar image" src="./assets/fred.png"/>{this.props.name}
			  </div>
			  <div className="image">
			    <img src={this.props.img}/>
			  </div>
			  <div className="content">
			    <div className="left floated">
			    	<Image className="heart-icon" src={this.state.liked ? './assets/redheart.png' : './assets/like-icon.png'} size='mini' onClick={this.toggleLike.bind(this)} inline/>
			      <Image src="./assets/comment-icon.png" size="mini"/>
			    </div><br />
			    <br/>
			    <div className="likes">{this.props.likes}{' '}likes</div><br/>
			    <div className="userCaption">{this.props.name}&#160;</div>
			    <div className="caption">{this.props.caption}</div><br />
			    <div className="comments">
			    	<Comments comments={this.state.comments} />
			  	</div>
			    <div className="left floated meta">14h</div>
			  </div>
			  <div className="extra content">
			    <div className="ui large transparent left icon input">
			      <i className="heart outline icon"></i>
			      <input type="text" placeholder="Add Comment..."></input>
			    </div>
			  </div>
			</div>
		)
	}
}

export default OneFeed;

