"use strict";

module.exports = function(sequelize, DataTypes) {
  var Group= sequelize.define("Group", {
    groupName: DataTypes.STRING,
    adminId:DataTypes.INTEGER,
    photoUrl: DataTypes.STRING,
    travelRoute: DataTypes.STRING,
    minExpense:DataTypes.INTEGER,
    maxExpense:DataTypes.INTEGER,
    maxNumOfPeople: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Group.hasMany(models.User),
        Group.hasMany(models.GroupMsg)
      }
    }
  });

  return Group;
};
