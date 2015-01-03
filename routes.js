var express = require('express');
var router  = express.Router();

var models  = require('./models');
var user = require('./controllers/user');
var group = require('./controllers/group');
var broadcast = require('./controllers/broadcast');




router.post('/user/login', user.login);
router.post('/user/signup', user.signup);
router.get('/user/:uid', user.checkAuth, user.getInfo);
router.post('/user/:uid',user.checkAuth, user.editInfo);

router.get('/user/:uid/group', user.checkAuth,user.getGroups);
router.delete('/user/:uid/group', user.checkAuth,user.quitGroup);
router.get('/user/:uid/group_request',user.checkAuth, user.getGroupRequests);
router.post('/user/:uid/group_request', user.checkAuth,user.addGroupRequest);

router.get('/user/:uid/friend',user.checkAuth, user.getFriends);
router.delete('/user/:uid/friend', user.checkAuth,user.deleteFriend);
router.get('/user/:uid/friend/:fid', user.checkAuth,user.getFriend);
router.get('/user/:uid/friend_request', user.checkAuth,user.getFriendRequests);
router.post('/user/:uid/friend_request',user.checkAuth, user.addFriendRequest);
router.post('/user/:uid/friend_request/:rid/accept', user.checkAuth,user.acceptFriendRequest);
router.post('/user/:uid/friend_request/:rid/reject', user.checkAuth,user.rejectFriendRequest);
//include group invitation
router.get('/user/:uid/message', user.checkAuth,user.getMessages);

router.get('/user/:uid/letter',user.checkAuth, user.getLetters);
router.post('/user/:uid/letter',user.checkAuth, user.addLetter);
router.delete('/user/:uid/letter',user.checkAuth, user.deleteLetter);
//
router.get('/group', group.getGroups);
router.post('/group/add', user.checkAuth,group.addGroup);
router.get('/group/:gid/info', group.getGroup);
router.post('/group/:gid/info',user.checkAuth, group.editGroup);
router.get('/group/:gid/request', user.checkAuth,group.getGroupRequests);
router.post('/group/:gid/request/:rid/accept',user.checkAuth, group.acceptGroupRequest);
router.post('/group/:gid/request/:rid/reject',user.checkAuth, group.rejectGroupRequest);
router.post('/group/:gid/invite', user.checkAuth,group.addGroupInvitation);


router.get('/sys/broadcast', broadcast.getBroadcasts);

module.exports = router;
