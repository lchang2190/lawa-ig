import React from 'react';
const Comment = (props) => (
	  <div>
	  	{
	  		props.comments.map((comment, index) => {
	  			return (
	  				<div key={index}>
	  					<div className="userComment">{comment.name} &#160;</div>
	  					<div className="userText">{comment.text}</div><br />
	  				</div>
	  			 )	
	  		})
	  	}
	  </div>
);

export default Comment;