var validator = require('validator');
var logger = require('../logger');
var models = require('../models');
var restapi = require('./restapi');
var async = require('async');
var text = require('../text');
var utils = require('./utils');


exports.getGroups = function (req, res, next) {
    models.Group.findAll(getQueryFromRequest(req)).then(function (groups) {
        res.json(restapi.ok(restapi.SUCCESS, groups));
    })
        .error(function () {
            res.json(restapi.error(restapi.FAILED, 'get groups failed'));
        });
}


exports.addGroup = function (req, res, next) {
    var userId = req.session.userId;
    console.log(userId);
    var group = models.Group.build(getAttributesFromRequest(req));
    group.adminId = userId;
    group.save()
        .then(function () {
            return group.addUser(userId);
        })
        .then(function () {
            return models.User.find(userId);
        })
        .then(function (user) {
            return user.addGroup(group.id);
        })
        .then(function () {
            res.json(restapi.ok(restapi.SUCCESS, group));
        })
        .fail(function (err) {
            logger.error(err.message);
            res.json(restapi.error(restapi.CREATE_GROUP_FAILED, 'create group failed'));
        });
}


exports.getGroup = function (req, res, next) {
    var groupId = validator.trim(req.params.gid);
    models.Group.find({
        where: {id: groupId},
        include: [
            {model: models.User}
        ]})
        .then(function (group) {
            var users = group.Users;
            for (var i = 0; i < users.length; i++) {
                utils.convertSummaryInfo(users[i]);
            }
            res.json(restapi.ok(restapi.SUCCESS, group));
        })
        .error(function () {
            res.json(restapi.error(restapi.FAILED, 'get group info failed'));
        });
}

exports.editGroup = function (req, res, next) {
    var groupId = validator.trim(req.params.gid);
    if (!validId(groupId)) {
        res.json(restapi.error(restapi.INVALID_REQ, 'invalid id'));
        return;
    }
    var group = models.Group.build(getAttributesFromRequest(req));
    models.Group.update(getAttributesFromRequest(req), { where: { id: groupId } })
        .success(function () {
            models.Group.find(groupId).then(function (group) {
                res.json(restapi.ok(restapi.SUCCESS, group));
            });
        })
        .error(function () {
            res.json(restapi.error(restapi.FAILED, 'update group info failed'));
        });
}


exports.getGroupRequests = function (req, res, next) {
    var groupId = validator.trim(req.params.gid);
    if (!validId(groupId)) {
        res.json(restapi.error(restapi.INVALID_REQ, 'invalid id'));
        return;
    }
    models.Group.find(groupId).then(function (group) {
        if (group == null) {
            res.json(restapi.error(restapi.FAILED, 'group no found'));
            return;
        }
        if (group.adminId != req.session.userId) {
            res.json(restapi.error(restapi.UNAUTHORIZED, 'unauthorized request'));
            return;
        }
        return models.MsgGroupRequest.findAll({
            where: { to_group_id: groupId},
            include: [
                {model: models.User, as: 'fromUser'},
                {model: models.Group, as: 'toGroup'}
            ]
        }).then(function (msgGroupRequests) {
            for (var i = 0; i < msgGroupRequests.length; i++) {
                utils.convertSummaryInfo(msgGroupRequests[i].fromUser);
            }
            res.json(restapi.ok(restapi.SUCCESS, msgGroupRequests));
        })
    })
        .error(function () {
            res.json(restapi.error(restapi.FAILED, 'get Group Requests failed'));
        });
}

exports.acceptGroupRequest = function (req, res, next) {
    var groupId = validator.trim(req.params.gid);
    var groupRequestId = validator.trim(req.params.rid);
    if (!validId(groupId) || !validId(groupRequestId)) {
        res.json(restapi.error(restapi.INVALID_REQ, 'invalid group id or groupRequest id'));
        return;
    }
    async.waterfall([
        function (cb) {
            models.Group.find(groupId).then(function (group) {
                if (group == null) {
                    cb(restapi.error(restapi.FAILED, 'group no found'));
                    return;
                }
                if (group.adminId != req.session.userId) {
                    cb(restapi.error(restapi.UNAUTHORIZED, 'unauthorized request'));
                    return;
                }
                cb(null, group);
            })
        },
        function (group, cb) {
            models.MsgGroupRequest.find(groupRequestId).then(function (msgGroupRequest) {
                if (msgGroupRequest == null || msgGroupRequest.to_group_id != groupId) {
                    cb(restapi.error(restapi.GROUP_REQUEST_NOT_EXISTS, 'group request not exists'));
                    return;
                }
                cb(null, group, msgGroupRequest);
            });
        },
        function (group, msgGroupRequest, cb) {
            var fromUid = msgGroupRequest.from_user_id;
            msgGroupRequest.destroy().then(function () {
                cb(null, group, fromUid);
            });
        },
        function (group, fromUid, cb) {
            group.addUser(fromUid)
                .then(function () {
                    return models.User.find(fromUid)
                })
                .then(function (user) {
                    return user.addGroup(groupId);
                })
                .then(function () {
                    res.json(restapi.ok(restapi.SUCCESS));
                    cb(null, fromUid);
                })
                .fail(function (err) {
                    console.log(err.message)
                    cb(restapi.error(restapi.FAILED, 'accept group request failed'));
                })
        },
        //add to msg_private
        function (fromUid, cb) {
            var msgPrivate = models.MsgPrivate.build({
                UserId: fromUid,
                content: require('util').format(text.ENTER_GROUP_SUCCESS, groupId)
            })
            msgPrivate.save()
                .then(function () {
                })
                .fail(function (err) {
                    logger.error(err.message);
                })
        }
    ], function (restErr, result) {
        res.json(restErr);
    });
}


exports.rejectGroupRequest = function (req, res, next) {
    var groupId = validator.trim(req.params.gid);
    var groupRequestId = validator.trim(req.params.rid);
    if (!validId(groupId) || !validId(groupRequestId)) {
        res.json(restapi.error(restapi.INVALID_REQ, 'invalid group id or groupRequest id'));
        return;
    }
    async.waterfall([
        function (cb) {
            models.Group.find(groupId).then(function (group) {
                if (group == null) {
                    cb(restapi.error(restapi.FAILED, 'group no found'));
                    return;
                }
                if (group.adminId != req.session.userId) {
                    cb(restapi.error(restapi.UNAUTHORIZED, 'unauthorized request'));
                    return;
                }
                cb(null, group);
            })
        },
        function (group, cb) {
            models.MsgGroupRequest.find(groupRequestId).then(function (msgGroupRequest) {
                if (msgGroupRequest == null || msgGroupRequest.to_group_id != groupId) {
                    cb(restapi.error(restapi.GROUP_REQUEST_NOT_EXISTS, 'group request not exists'));
                    return;
                }
                cb(null, group, msgGroupRequest);
            });
        },
        function (group, msgGroupRequest, cb) {
            msgGroupRequest.destroy().then(function () {
                res.json(restapi.ok(restapi.SUCCESS));
            })
                .fail(function (err) {
                    cb(restapi.error(restapi.FAILED, 'reject group request failed'));
                })
        }
    ], function (restErr, result) {
        res.json(restErr);
    });
}

exports.addGroupInvitation = function (req, res, next) {
    var groupId = validator.trim(req.params.gid);
    var inviteeId = validator.trim(req.body.invitee_id);
    var content = validator.trim(req.body.content);
    if (!validId(groupId) || !validId(inviteeId)) {
        res.json(restapi.error(restapi.INVALID_REQ, 'invalid group id or invitee_id'));
        return;
    }
    async.waterfall([
        function (cb) {
            models.Group.find(groupId).then(function (group) {
                if (group == null) {
                    cb(restapi.error(restapi.FAILED, 'group no found'));
                    return;
                }
                if (group.adminId != req.session.userId) {
                    cb(restapi.error(restapi.UNAUTHORIZED, 'unauthorized request'));
                    return;
                }
                cb(null, group);
            })
        },
        function (group, cb) {
            models.User.find(inviteeId).then(function (invitee) {
                if (invitee == null) {
                    cb(restapi.error(restapi.FAILED, 'user no found'));
                    return;
                }
                cb(null, group, invitee);
            })
        },
        function (group, invitee, cb) {
            var msgPrivate = models.MsgPrivate.build({
                content: require('util').format(text.GROUP_INVITATION, group.name + (group.id), content)
            })
            msgPrivate.save().then(function () {
                msgPrivate.setUser(inviteeId);
                res.json(restapi.ok(restapi.SUCCESS));
            }).fail(function (err) {
                cb(restapi.error(restapi.FAILED, 'create invitation failed'));
            })
        }
    ], function (restErr, result) {
        res.json(restErr);
    });
}

function getQueryFromRequest(req) {
    var where = {}
    if (req.body.name) {
        where.name = '%' + req.body.name + '%';
    }
    if (req.body.city) {
        where.city = req.body.city;
    }
    if (req.body.travelRoute) {
        where.travelRoute = '%' + req.body.travelRoute + '%';
    }
    if (req.body.minExpense) {
        where.minExpense = {gt: req.body.minExpense};
    }
    if (req.body.maxExpense) {
        where.maxExpense = {lt: req.body.maxExpense};
    }
    return {where: where};
}


function getAttributesFromRequest(req) {
    attr = {};
    if (req.body.name) {
        attr.name = req.body.name;
    }
    if (req.body.city) {
        attr.city = req.body.city;
    }
    if (req.body.photoUrl) {
        attr.photoUrl = req.body.photoUrl;
    }
    if (req.body.travelRoute) {
        attr.travelRoute = req.body.travelRoute;
    }
    if (req.body.minExpense) {
        attr.minExpense = req.body.minExpense;
    }
    if (req.body.hobby) {
        attr.hobby = req.body.hobby;
    }
    if (req.body.job) {
        attr.job = req.body.job;
    }
    if (req.body.birthday) {
        attr.birthday = req.body.birthday;
    }
    if (req.body.selfDesc) {
        attr.selfDesc = req.body.selfDesc;
    }
    return attr;
}


function validId(id) {
    var tester = /^\d{1,11}$/;
    return tester.test(id);
}