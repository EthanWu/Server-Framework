"use strict";

module.exports = function(sequelize, DataTypes) {
  var MsgFriendRequest= sequelize.define("MsgFriendRequest", {
    invitor: DataTypes.INTEGER,
    invitee: DataTypes.INTEGER,
    verifyContent: DataTypes.STRING,
    //accepted msg will be send to once nad removed from db, other msg will always be sent to user.
    state: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return MsgFriendRequest;
};
