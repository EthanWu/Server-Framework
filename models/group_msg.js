"use strict";

module.exports = function(sequelize, DataTypes) {
  var GroupMsg= sequelize.define("GroupMsg", {
    userId: DataTypes.INTEGER,
    invitee: DataTypes.INTEGER,
    type: DataTypes.ENUM('text','photo'),
    content: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return GroupMsg;
};
