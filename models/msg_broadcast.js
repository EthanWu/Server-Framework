"use strict";

module.exports = function (sequelize, DataTypes) {
    var MsgBroadcast = sequelize.define("MsgBroadcast", {
        type: DataTypes.INTEGER,
        title: DataTypes.STRING,
        content: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
            }
        }
    });

    return MsgBroadcast;
};
