const pg = require('pg');
const path = require('path');
const moment = require('moment');

const connection = process.env.DATABASE_URL ? 
  { connectionString: process.env.DATABASE_URL } : 
  { host: 'localhost', database: 'lawa_db' };

const pool = new pg.Pool(connection);
pool.connect();

//get all users following
const getUsersFollowing = function (userId) {
  return pool.query('SELECT users.user_id, users.name, users.description, users.prof_pic \
    FROM users INNER JOIN followers \
    ON followers.following_user = $1 AND followers.followed_user = users.user_id',
    [userId]);
};

//get user followers
const getUsersFollowers = function (userId) {
  return pool.query('SELECT users.user_id, users.name, users.description, users.prof_pic \
    FROM users INNER JOIN followers \
    ON followers.followed_user = $1 AND followers.following_user = users.user_id',
    [userId]);
};

//get all posts following
const getAllPosts = function (userId) {
  return pool.query('SELECT posts.post_id, posts.img, posts.like_count, posts.user_id, posts.caption, posts.created_at FROM posts \
	INNER JOIN followers ON followers.following_user = $1 AND \
		followers.followed_user = posts.user_id', [userId]);
};

const getPostsLiked = function (userId, postsIdArray) {
  return pool.query('SELECT likes.post_id FROM likes INNER JOIN posts \
    ON posts.post_id = likes.post_id AND likes.user_id = $1',
    [userId]);
};

const insertPost = function (caption, userId, fileName, timestamp) {
  const AWSUrl = 'https://s3-us-west-1.amazonaws.com/lawa-ig/images/';
  const fileUrl = `${AWSUrl}${userId}-${encodeURIComponent(timestamp)}${fileName.slice(-4)}`;
  console.log(fileUrl);
  return pool.query('INSERT INTO posts(img, like_count, user_id, caption, created_at) \
    VALUES ($1, $2, $3, $4, $5)',
    [fileUrl, 0, userId, caption, timestamp]);
};
//for search and profile change
const getAllUsernames = function () {
  return pool.query('SELECT user_id, name FROM users');
};

const checkForUser = function (facebookId) {
  return pool.query('SELECT * FROM users WHERE user.fb_id = $1', [facebookId]);
};
const insertNewFbUser = function (newUser) {
  return pool.query('INSERT INTO users (fb_id, fb_name, prof_pic) VALUES ($1, $2, $3)', [newUser.id, newUser.displayName, newUser.photo]);
};

const getUserProfile = function (userId) {
  return pool.query('SELECT users.user_id, users.name, users.prof_pic, users.description FROM users \
    WHERE users.user_id = $1',
    [userId]);
};

const getUserPosts = function (usedId) {
  return pool.query('SELECT * FROM posts WHERE user_id = $1', [userId]);
};

const addLike = function(userId, postId) {
  return pool.query('INSERT INTO likes (user_id, post_id, created_at) VALUES ($1, $2, $3)',
    [userId, postId, moment().format()]);
};

const rmLike = function(userId, postId) {
  return pool.query('DELETE from likes where likes.user_id = $1 and likes.post_id = $2',
    [userId, postId]);
};

const checkLike = function(userId, postId) {
  return pool.query('SELECT * from likes WHERE likes.user_id = $1 and likes.post_id = $2',
    [userId, postId]);
};

const addFollow = function(followerId, followedId) {
  return pool.query('INSERT INTO followers (followed_user, following_user, created_at) VALUES ($1, $2, $3)',
    [followedId, followerId, moment().format()]);
};

const rmFollow = function(followerId, followedId) {
  return pool.query('DELETE from followers WHERE followers.followed_user = $1 AND followers.following_user = $2; ',
    [followedId, followerId]);
};

const checkFollow = function(followerId, followedId) {
  return pool.query('SELECT * FROM followers WHERE followers.followed_user = $1 AND followers.following_user = $2',
    [followedId, followerId]);
};

const addComment = function(userId, postId, text) {
  return pool.query('INSERT INTO comments (user_id, post_id, text, created_at) VALUES ($1, $2, $3, $4)',
    [userId, postId, text, moment().format()]);
};

const rmComment = function(userId, postId) {
  return pool.query('',
    [userId, postId]);
};

const getLikesOnPost = function (postId) {
  return pool.query('SELECT users.user_id, users.name, users.prof_pic \
    FROM users INNER JOIN likes \
    ON likes.post_id = $1 AND likes.user_id = users.user_id',
    [postId]);
};

module.exports = {
  getUsersFollowing,
  getUsersFollowers,
  getAllPosts,
  getPostsLiked,
  insertPost,
  getAllUsernames,
  getUserPosts,
  getUserProfile,
  addLike,
  rmLike,
  addFollow,
  rmFollow,
  addComment,
  rmComment,
  checkForUser,
  insertNewFbUser,
  getLikesOnPost,
  checkLike, 
  checkFollow
};
