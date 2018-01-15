import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import FeedGrid from './feed_grid.jsx';
import FeedBar from './feed_bar.jsx';
import axios from 'axios';

class AllFeeds extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedInUser: this.props.user,
			userFeeds: [],
			userInfo: ''
		}
	}

	componentDidMount() {
		this.updateFeed(this.props.user.user_id);
		this.getUserInfo(this.props.user.user_id);
	}

	updateFeed(userId) {
		axios.post('/feed', {userId})
			.then((response) => {
				this.setState({
					userFeeds: response.data
				})
			})
			.catch((error) => {
				console.log('axios get error', error)
			})
	}

	getUserInfo(userId) {
		axios.post('/user', {userId})
			.then((response) => {
				this.setState({
					userInfo: response.data,
				})
				console.log('userinfo', this.state.userInfo);
			})
			.catch((error) => {
				console.log('axios get errorfgfd', error)
			})
	}

	render() {
		return (
			<div>
				<div className="feedBar">
					<FeedBar loggedInUser={this.state.userInfo} />
				</div>
				<div className="all-feeds">
					<FeedGrid loggedInUser={this.state.loggedInUser} userFeeds={this.state.userFeeds} />
				</div>
			</div>
		)
	}
}


export default AllFeeds;