"use strict";

module.exports = function(sequelize, DataTypes) {
  var MsgFriendRequest= sequelize.define("MsgFriendRequest", {
    verifyContent: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        MsgFriendRequest.belongsTo(models.User, {as:'fromUser',foreignKey: 'from_user_id'});
        MsgFriendRequest.belongsTo(models.User, {as:'toUser',foreignKey: 'to_user_id'});
      }
    }
  });

  return MsgFriendRequest;
};
