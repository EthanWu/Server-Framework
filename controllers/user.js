var validator = require('validator');
var logger = require('../logger');
var models  = require('../models');
var restapi  = require('./restapi');
var async = require('async');
var Sequelize = require("sequelize");
var bcrypt = require('bcryptjs');
var text=require('../text')

exports.signup = function (req, res, next) {
    var phone = validator.trim(req.body.phone);
    if(!validPhone(phone)){
        res.json(restapi.error(restapi.INVALID_PHONE,'invalid phone'));
        return;
    }
    var password = validator.trim(req.body.password);
    if(!validPassword(password)){
        res.json(restapi.error(restapi.INVALID_PASSWD,'invalid password'));
        return;
    }
    models.User.find({ where: { phone:phone} }).then(function(result) {
        if (result != null) {
            res.json(restapi.error(restapi.PHONE_REGISTERED, 'phone registered'));
            return;
        }
        var user = models.User.build({
            phone: phone,
            password: bcrypt.hashSync(password, 8),
            nickname:makeNickname()
        });
        return user.save()
            .then(function(){
                res.json(restapi.ok(restapi.SUCCESS));
            })
    })
        .fail(function (err) {
            logger.error(err);
            res.json(restapi.error(restapi.CREATE_USER_FAILED,'create user failed'));
        });
}

exports.checkAuth=function(req, res, next) {
    if (!req.session.userId) {
        res.json(restapi.error(restapi.UNAUTHORIZED, 'not login'));
        return;
    } else {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
    }
}

exports.login = function (req, res, next) {
    var phone = validator.trim(req.body.phone);
    var password = validator.trim(req.body.password);
    if (!phone || !password) {
        res.status(422);
        res.json(restapi.error(restapi.INVALID_PHONE_PASSWD, 'invalid phone or password'));
        return;
    }
    models.User.find({ where: { phone:phone} }).then(function(user) {
        if (user == null) {
            res.json(restapi.error(restapi.NOT_REGISTERED, 'phone is not registered'));
            return;
        }
        if(bcrypt.compareSync(password, user.password)){
            req.session.userId=user.id;
            res.json(restapi.ok(restapi.SUCCESS,getFullInfo(user)));
        }else{
            res.json(restapi.error(restapi.WRONG_PASSWD, 'wrong password'));
        }
    });
}

exports.getInfo = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    if(!validId(userId)){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid id'));
        return;
    }
    models.User.find(userId).then(function(user) {
        if (user == null) {
            res.json(restapi.error(restapi.USER_NO_FOUND, 'user no found'));
            return;
        }
        if(userId==req.session.userId){
            req.session.userId=user.id;
            res.json(restapi.ok(restapi.SUCCESS,getFullInfo(user)));
        }else{
            res.json(restapi.ok(restapi.SUCCESS,getSummaryInfo(user)));
        }
    });
}

exports.editInfo = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    if(!validId(userId) ||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid id'));
        return;
    }
    models.User.update( getAttributesFromRequest(req),{ where: { id : userId } })
        .success(function () {
            models.User.find(userId).then(function(user) {
                res.json(restapi.ok(restapi.SUCCESS,getFullInfo(user)));
            });
        })
        .error(function () {
            res.json(restapi.error(restapi.FAILED, 'update user info failed'));
        });
}

exports.getGroups = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    if(!validId(userId) ||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid id'));
        return;
    }
    models.User.find(userId).then(function (user) {
        return user.getGroups().then(function(groups) {
            for(var i=0;i<groups.length;i++){
                delete groups[i].dataValues.GroupsUser;
            }
            res.json(restapi.ok(restapi.SUCCESS,groups));
        });
    })
        .error(function () {
            res.json(restapi.error(restapi.FAILED, 'get groups failed'));
        });
}

exports.quitGroup = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var groupId = validator.trim(req.body.group_id);
    if(!validId(userId) ||!validId(groupId) ||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid id'));
        return;
    }
    models.User.find(userId).then(function (user) {
        return models.Group.find(groupId).then(function (group) {
            return user.removeGroup(group).then(function() {
                return user.getGroups().then(function(groups){
                    res.json(restapi.ok(restapi.SUCCESS, groups));
                });
            });
        })
    })
        .error(function () {
            res.json(restapi.error(restapi.FAILED, 'quit group failed'));
        });
}

exports.getGroupRequests = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    if(!validId(userId) ||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid id'));
        return;
    }
    models.MsgGroupRequest.findAll({
        where: {from_user_id: userId},
        include: [{model: models.Group, as: 'toGroup'}]
    }).then(function (msgGroupRequests) {
        res.json(restapi.ok(restapi.SUCCESS,msgGroupRequests));
    })
        .error(function () {
            res.json(restapi.error(restapi.FAILED, 'get Group Requests failed'));
        });
}

exports.addGroupRequest = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var groupId = validator.trim(req.body.group_id);
    var verifyContent = validator.trim(req.body.verify_content);
    if(!validId(userId) ||!validId(groupId)||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid user id or group id'));
        return;
    }

    models.Group.find(groupId).then(function(group){
        if(group==null){
            res.json(restapi.error(restapi.GROUP_NO_FOUND,'group no found'));
            return;
        }
        models.MsgGroupRequest.find({ where: { from_user_id:userId,to_group_id:group.id} }).then(function (msgGroupRequest) {
            if(msgGroupRequest){
                res.json(restapi.error(restapi.GROUP_REQUEST_EXISTS,'group request exists'));
                return;
            }
            var msgGroupRequest = models.MsgGroupRequest.build({
                from_user_id: userId,
                to_group_id:groupId,
                verifyContent: verifyContent
            });
            return msgGroupRequest.save()
                .then(function(){
                    res.json(restapi.ok(restapi.SUCCESS));
                })
        })
            .fail(function (err) {
                logger.error(err);
                res.json(restapi.error(restapi.ADD_GROUP_REQUEST_FAILED,'add group request failed'));
            });
    })
}

exports.getFriends = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    if(!validId(userId) ||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid id'));
        return;
    }
    models.User.find(userId)
        .then(function (user) {
            return user.getFriends();
        })
        .then(function(friends){
            for(i=0;i<friends.length;i++){
                friends[i]=getSummaryInfo(friends[i]);
            }
            res.json(restapi.ok(restapi.SUCCESS,friends));
        })
        .fail(function () {
            res.json(restapi.error(restapi.FAILED, 'get Friends failed'));
        });
}

exports.deleteFriend = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var friendId = validator.trim(req.body.friend_id);
    if(!validId(userId) ||!validId(friendId) ||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid id'));
        return;
    }
    models.User.find(userId).then(function (user) {
        return models.User.find(friendId)
            .then(function (friend) {
                return user.removeFriend(friend);
            })
            .then(function() {
                return user.getFriends();
            })
            .then(function(friends){
                for(i=0;i<friends.length;i++){
                    friends[i]=getSummaryInfo(friends[i]);
                }
                res.json(restapi.ok(restapi.SUCCESS,friends));
            });
    })
        .fail(function () {
            res.json(restapi.error(restapi.FAILED, 'delete Friends failed'));
        });
}

exports.getFriend = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var friendId = validator.trim(req.params.fid);
    if(!validId(userId) ||!validId(friendId) ||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid id'));
        return;
    }
    models.User.find(userId).then(function (user) {
        return models.User.find(friendId).then(function (friend) {
            return user.hasFriend(friend.id).then(function() {
                res.json(restapi.ok(restapi.SUCCESS,getFullInfo(friend)));
            });
        })
    })
        .error(function () {
            res.json(restapi.error(restapi.FAILED, 'get friend detail failed'));
        });
}

exports.getFriendRequests = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    if(!validId(userId) ||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid id'));
        return;
    }
    var allMsgFriendRequests={};
    models.MsgFriendRequest.findAll({
        where: { from_user_id:userId},
        include: [{ model: models.User, as: 'toUser' }]
    }).then(function (msgFriendRequests) {
        for(i=0;i<msgFriendRequests.length;i++){
            msgFriendRequests[i].toUser=getSummaryInfo(msgFriendRequests[i].toUser);
        }
        allMsgFriendRequests.out=msgFriendRequests;
        return models.MsgFriendRequest.findAll({ where: { to_user_id:userId}, include: [{ model: models.User, as: 'fromUser' }] })
    }).then(function (msgFriendRequests) {
        for(i=0;i<msgFriendRequests.length;i++){
            msgFriendRequests[i].fromUser=getSummaryInfo(msgFriendRequests[i].fromUser);
        }
        allMsgFriendRequests.in=msgFriendRequests;
        res.json(restapi.ok(restapi.SUCCESS,allMsgFriendRequests));
    })
        .error(function (err) {
            logger.error(err.message);
            res.json(restapi.error(restapi.FAILED, 'get friend Requests failed'));
        });
}

exports.addFriendRequest = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var friendId = validator.trim(req.body.friend_id);
    var verifyContent = validator.trim(req.body.verify_content);
    if(!validId(userId) ||!validId(friendId)||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid user id or friend id'));
        return;
    }

    models.User.find(friendId).then(function(friend){
        if(friend==null){
            res.json(restapi.error(restapi.FRIEND_NO_FOUND,'friend no found'));
            return;
        }
        models.MsgFriendRequest.find({ where: { from_user_id:userId,to_user_id:friend.id} }).then(function (msgFriendRequest) {
            if(msgFriendRequest){
                res.json(restapi.error(restapi.FRIEND_REQUEST_EXISTS,'friend request exists'));
                return;
            }
            var msgFriendRequest = models.MsgFriendRequest.build({
                from_user_id: userId,
                to_user_id: friend.id,
                verifyContent: verifyContent
            });
            return msgFriendRequest.save()
                .then(function(){
                    res.json(restapi.ok(restapi.SUCCESS));
                })
        })
            .fail(function (err) {
                logger.error(err);
                res.json(restapi.error(restapi.ADD_FRIEND_REQUEST_FAILED,'add friend request failed'));
            });
    })
}

exports.acceptFriendRequest = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var friendRequestId = validator.trim(req.params.rid);
    if(!validId(userId) ||!validId(friendRequestId)||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid user id or friendRequest id'));
        return;
    }
    var toUid=userId;
    async.waterfall([
        function (cb) {
            models.MsgFriendRequest.find(friendRequestId).then(function (msgFriendRequest) {
                if (msgFriendRequest==null||msgFriendRequest.to_user_id!=userId) {
                    cb(restapi.error(restapi.FRIEND_REQUEST_NOT_EXISTS, 'friend request not exists'));
                }else{
                    cb(null,msgFriendRequest);
                }
            });
        },
        function(msgFriendRequest,cb){
            var fromUid=msgFriendRequest.from_user_id;
            msgFriendRequest.destroy().then(function(){
                cb(null,fromUid);
            });
        },
        function(fromUid,cb){
            models.User.find(fromUid)
                .then(function(fromUser){
                    return fromUser.addFriend(toUid)
                })
                .then(function(){
                    return models.User.find(toUid)
                })
                .then(function(toUser){
                    return toUser.addFriend(fromUid)
                })
                .then(function(){
                    res.json(restapi.ok(restapi.SUCCESS));
                    cb(null,fromUid);
                }).fail(function(err){
                    cb(restapi.error(restapi.FAILED, 'accept friend request failed'));
                })
        },
        //add to msg_private
        function(fromUid,cb){
            var msgPrivate=models.MsgPrivate.build({
                UserId:toUid,
                content: require('util').format(text.ADD_FRIEND_SUCCESS,fromUid)
            })
            msgPrivate.save()
                .then(function () {
                    cb(null,fromUid);
                })
                .fail(function (err) {
                    logger.error(err.message);
                })
        },
        function(fromUid,cb){
            var msgPrivate=models.MsgPrivate.build({
                UserId:fromUid,
                content: require('util').format(text.ADD_FRIEND_SUCCESS,toUid)
            })
            msgPrivate.save()
                .then(function () {})
                .fail(function (err) {
                    logger.error(err.message);
                })
        }
    ],function(restErr,result){
        restapi.error(restErr);
    });
}

exports.rejectFriendRequest = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var friendRequestId = validator.trim(req.params.rid);
    if(!validId(userId) ||!validId(friendRequestId)||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid user id or friendRequest id'));
        return;
    }
    models.MsgFriendRequest.find(friendRequestId).then(function (msgFriendRequest) {
        if (msgFriendRequest==null||msgFriendRequest.to_user_id!=userId) {
            res.json(restapi.error(restapi.FRIEND_REQUEST_NOT_EXISTS, 'friend request not exists'));
            return;
        }
        return msgFriendRequest.destroy()
            .then(function(){
                res.json(restapi.ok(restapi.SUCCESS));
            });
    })
        .error(function () {
            res.json(restapi.error(restapi.FAILED, 'reject friend request failed'));
        });
}

exports.getLetters = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    if(!validId(userId)||userId!=req.session.userId){
        res.json(restapi.error(restapi.INVALID_REQ,'invalid id'));
        return;
    }
    models.Letter.findAll(
        {
            where:Sequelize.or({in_user_has_id:userId},{out_user_has_id:userId} ),
            include: [{ model: models.User, as: 'fromUser' }, { model: models.User, as: 'toUser' }]
        }).then(function (letters) {
            for(i=0;i<letters.length;i++){
                letters[i].fromUser=getSummaryInfo(letters[i].fromUser);
                letters[i].toUser=getSummaryInfo(letters[i].toUser);
            }
            res.json(restapi.ok(restapi.SUCCESS,letters));
        });
}

exports.addLetter = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var toUid = validator.trim(req.body.to_uid);
    var content = validator.trim(req.body.content);
    if (!validId(userId) || !validId(toUid) || userId != req.session.userId) {
        res.json(restapi.error(restapi.INVALID_REQ, 'invalid user id'));
        return;
    }
    async.waterfall([
        function (cb) {
            models.User.find(userId).then(function (user) {
                if (user == null) {
                    cb(restapi.error(restapi.USER_NO_FOUND, 'user no found'));
                } else {
                    cb(null, user);
                }
            })
        },
        function (fromUser, cb) {
            models.User.find(toUid).then(function (toUser) {
                if (toUser == null) {
                    cb(restapi.error(restapi.USER_NO_FOUND, 'to_user no found'));
                } else {
                    cb(null, fromUser, toUser);
                }
            })
        },
        function (fromUser, toUser, cb) {
            models.Letter.build({
                from_user_id:fromUser.id,
                to_user_id:toUser.id,
                content:content
            }).save()
                .then(function (letter) {
                    return fromUser.addOutLetter(letter)
                        .then(function () {
                            return toUser.addInLetter(letter);
                        })
                })
                .then(function(){
                    res.json(restapi.ok(restapi.SUCCESS));
                })
        }
    ], function (restErr) {
        restapi.error(restErr);
    });
}

exports.deleteLetter = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var letterId = validator.trim(req.body.lid);
    if (!validId(userId) || !validId(letterId) || userId != req.session.userId) {
        res.json(restapi.error(restapi.INVALID_REQ, 'invalid user id'));
        return;
    }
    async.waterfall([
        function (cb) {
            models.User.find(userId).then(function (user) {
                if (user == null) {
                    cb(restapi.error(restapi.USER_NO_FOUND, 'user no found'));
                } else {
                    cb(null, user);
                }
            })
        },
        function (user,cb) {
            models.Letter.find(letterId).then(function (letter) {
                if (letter == null) {
                    cb(restapi.error(restapi.USER_NO_FOUND, 'letter no found'));
                } else {
                    cb(null, user,letter);
                }
            })
        },
        function (user,letter, cb) {
            user.hasInLetter(letterId).then(function(hasInLetter){
                if(hasInLetter){
                    user.removeInLetter(letter).then(function(){
                        cb(null,user,letter);
                    })
                }else{
                    cb(null,user,letter);
                }
            })
        },
        function (user, letter,cb) {
            user.hasOutLetter(letterId).then(function(hasOutLetter){
                if(hasOutLetter){
                    user.removeOutLetter(letter).then(function(){
                        res.json(restapi.ok(restapi.SUCCESS));
                    })
                }else{
                    cb(restapi.LETTER_NO_FOUND, 'letter no found');
                }
            })
        }
    ], function (restErr) {
        restapi.error(restErr);
    });
}

exports.getMessages = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var afterTimestamp = validator.trim(req.body.after_timestamp);
    if (!validId(userId) || userId != req.session.userId) {
        res.json(restapi.error(restapi.INVALID_REQ, 'invalid user id'));
        return;
    }
    //if afterTimestamp it not given, afterTime is set to  2 days before by default.
    afterTime = new Date();
    afterTime.setDate(afterTime.getDate() - 2);
    if (afterTimestamp) {
        if( !validTimestamp(afterTimestamp)) {
            res.json(restapi.error(restapi.INVALID_REQ, 'invalid timestamp'));
            return;
        }
        afterTime = new Date(afterTimestamp*1000);
    }
    models.MsgPrivate.findAll({where:{UserId:userId,createdAt:{gt:afterTime}}}).then(function(msgPrivates){
        res.json(restapi.ok(restapi.SUCCESS,msgPrivates));
    })
}

function getAttributesFromRequest(req){
    attr={};
    if(req.body.password){
        attr.password=req.body.password;
    }
    if(req.body.nickname){
        attr.nickname=req.body.nickname;
    }
    if(req.body.sex){
        attr.sex=req.body.sex;
    }
    if(req.body.city){
        attr.city=req.body.city;
    }
    if(req.body.email){
        attr.email=req.body.email;
    }
    if(req.body.hobby){
        attr.hobby=req.body.hobby;
    }
    if(req.body.job){
        attr.job=req.body.job;
    }
    if(req.body.birthday){
        attr.birthday=req.body.birthday;
    }
    if(req.body.selfDesc){
        attr.selfDesc=req.body.selfDesc;
    }
    return attr;
}
function getFullInfo(user) {
    delete user.dataValues.password;
    return user;
}

function getSummaryInfo(user) {
    delete user.dataValues.phone;
    delete user.dataValues.password;
    return user;
}


function validTimestamp(timestamp){
    var now=Date.now()/1000;
    var timestamp = parseInt(timestamp) || 0;
    //only accept request for last three month.
    if( (now-timestamp)<=0 || (now-timestamp)>3600*24*180 ){
        return false;
    }else{
        return true;
    }

}

function validPhone(phone){
    var reg0=/^13\d{9}$/;
    var reg1=/^15\d{9}$/;
    var reg2=/^18\d{9}$/;
    var reg3=/^14\d{9}$/;
    var valid=false;
    if (reg0.test(phone) | reg1.test(phone)|reg2.test(phone) |reg3.test(phone)){
        valid=true;
    }
    return valid;
}

function validPassword(pwd){
    var reg = /^[x00-x7f]+$/;
    if (! reg.test(pwd)){
        return false;
    }
    if (pwd.length < 6 || pwd.length > 16){
        return false;
    }
    return true;
}


function validId(id){
    var tester=/^\d{1,11}$/;
    return tester.test(id);
}

function makeNickname()
{
    var text = "tmp_";
    var possible = "0123456789";
    for( var i=0; i < 8; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}