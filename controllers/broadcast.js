var validator = require('validator');
var logger = require('../logger');
var models = require('../models');
var restapi = require('./restapi');
var async = require('async');
var Sequelize = require("sequelize");
var bcrypt = require('bcryptjs');
var text = require('../text')

exports.getBroadcasts = function (req, res, next) {
    var userId = validator.trim(req.params.uid);
    var afterTimestamp = validator.trim(req.body.after_timestamp);
    //if afterTimestamp it not given, afterTime is set to  1 year before by default.
    var afterTime = new Date();
    afterTime.setDate(afterTime.getDate() - 360);
    if (afterTimestamp) {
        if (!validTimestamp(afterTimestamp)) {
            res.json(restapi.error(restapi.INVALID_REQ, 'invalid timestamp'));
            return;
        }
        afterTime = new Date(afterTimestamp * 1000);
    }
    models.MsgBroadcast.findAll({where: {createdAt: {gt: afterTime}}}).then(function (broadcasts) {
        res.json(restapi.ok(restapi.SUCCESS, broadcasts));
    })
}
