"use strict";

module.exports = function(sequelize, DataTypes) {
  var Letter= sequelize.define("Letter", {
    contact: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    type: DataTypes.ENUM('in','out'),
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Letter;
};
