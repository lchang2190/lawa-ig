var controller = require('./controller');
var router = require('express').Router();
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 52428800 },
});

router.post('/usersfollowing', controller.usersFollowing); // accepts userId, returns users that userId is following
router.post('/usersfollowers', controller.usersFollowers); // accepts userId, returns users following that userId
router.post('/feed', controller.renderFeed); // accepts userId, return posts from users that user is following, including whether that user has liked those posts
router.get('/profile', controller.allUserNames); // gets all usernames in db for search -- can be modified to just get following (real ig filters these to the top)
router.post('/profile', controller.currentUserProfile); //gets a neat object will all data needed for profile view
router.post('/post', upload.single('image'), controller.insertPost);
router.post('/like', controller.changeLike);
router.post('/comment', controller.changeComment);
router.post('/follow', controller.changeFollow);
router.post('/comments', controller.getComments);
router.post('/uploadprofimg', upload.single('image'), controller.uploadProfImg);
router.post('/description', controller.updateDescription);
router.post('/logon', controller.feed);
router.post('/id', controller.switchUser);
router.post('/signUp', controller.signUp);
router.post('/user', controller.getUserInfo);

module.exports = router;