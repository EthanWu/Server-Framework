"use strict";

module.exports = function(sequelize, DataTypes) {
  var Letter= sequelize.define("Letter", {
    content: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Letter.belongsTo(models.User, {as:'fromUser',foreignKey: 'from_user_id'});
        Letter.belongsTo(models.User, {as:'toUser',foreignKey: 'to_user_id'});
      }
    }
  });

  return Letter;
};
