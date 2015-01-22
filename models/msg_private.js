"use strict";

module.exports = function (sequelize, DataTypes) {
    var MsgPrivate = sequelize.define("MsgPrivate", {
        title: DataTypes.STRING,
        content: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
                MsgPrivate.belongsTo(models.User);
            }
        }
    });

    return MsgPrivate;
};