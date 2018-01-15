import React from 'react';
import { Comment, Image} from 'semantic-ui-react';
import FeedGrid from './feed_grid.jsx';
import Comments from './comment.jsx';
import axios from 'axios';
import moment from 'moment';

//this renders one indiviudal post on /feed
class OneFeed extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			comments: [],
			liked: false,
			postLikes: [],
			likeCount: 0,
			newComment: ''
		}
		this.getLikesOnPost();
		this.loadComments(this.props.post);
	}

	componentDidMount() {
		// this.loadComments(this.props.post);
		this.checkIfLike();
	}

	//gets the like on a single post using postId
	getLikesOnPost() {
    var bodyObj = {postId: this.props.post};
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
        this.setState({
        	postLikes: jsonData.rows,
        });
      });
  }

	//changes the like of post
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


  checkIfLike() {
    var bodyObj = {userId: this.props.loggedInUser.user_id, postId: this.props.post};
    bodyObj.status = 'checkLike';

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
        if (jsonData.rows && jsonData.rows.length) {
          this.setState({liked: true});
        }
      });
  }


	liveUpdateLike() {
    let { postLikes } = this.state;

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
  //toggles the 'heart' img of a like/unlike post. also sends user liked to database
	toggleLike() {
    //PUSH picture data into logged in user's liked photos

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

	////////COMMENTS//////////

	 //load all comments of postId
	loadComments(postId) {
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
	//changes input value as user types
	onCommentType(e) {
    this.setState({newComment: e.target.value});
    // this.loadComments(this.props.post)
  }

  //on Enter, new comment is added to Db
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.addComment(this.state.newComment);
      this.setState({newComment: ''});
      this.nameInput.value = '';      
    }
    this.loadComments(this.props.post)
  }

  // liveUpdateComment(content) {
  // 	console.log('hi');
  //   this.setState({comments: [...this.state.comments, content]});
  // }

  //helper function adding comment to db
  addComment(content) {

    var bodyObj = {
      userId: this.props.loggedInUser.user_id, 
      postId: this.props.post,
      text: content,
      status: 'addComment'
    };

    var postConfig = {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(bodyObj)
    };

    fetch('/comment', postConfig)
      .then(res => setTimeout(this.props.getComments, 200));

  }

  //everything rendered on ONE individual post on /feed
	render () {
		return (
			<div className="ui card">
			  <div className="content">
			    <img className="ui avatar image" src={this.props.pic}/>{this.props.name}
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
			    <div className="likes">{this.state.postLikes.length}{' '}likes</div><br/>
			    <div className="userCaption">{this.props.name}&#160;</div>
			    <div className="caption">{this.props.caption}</div><br />
			    <div className="comments">
			    	<Comments comments={this.state.comments} />
			  	</div>
			    <div className="left floated meta">{moment(this.props.date).fromNow()}</div>
			  </div>
			  <div className="extra content">
			    <div className="ui large transparent left icon input">
			      <input className="textField" ref={input => this.nameInput = input }  type="text" placeholder="Add Comment..." onChange={e => this.onCommentType(e)} onKeyPress={e => this.handleKeyPress(e)}></input>
			    </div>
			  </div>
			</div>
		)
	}
}

export default OneFeed;

