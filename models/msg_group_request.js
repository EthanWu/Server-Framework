"use strict";
var User = require('./user');

module.exports = function (sequelize, DataTypes) {
    var MsgGroupRequest = sequelize.define("MsgGroupRequest", {
        verifyContent: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                MsgGroupRequest.belongsTo(models.User, {as: 'fromUser', foreignKey: 'from_user_id'});
                MsgGroupRequest.belongsTo(models.Group, {as: 'toGroup', foreignKey: 'to_group_id'});
            }
        }
    });

    return MsgGroupRequest;
};
