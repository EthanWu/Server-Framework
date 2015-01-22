"use strict";

module.exports = function (sequelize, DataTypes) {
    var Group = sequelize.define("Group", {
        name: DataTypes.STRING,
        adminId: DataTypes.INTEGER,
        city: DataTypes.STRING,
        photoUrl: DataTypes.STRING,
        travelRoute: DataTypes.STRING,
        minExpense: DataTypes.INTEGER,
        maxExpense: DataTypes.INTEGER,
        maxNumOfPeople: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function (models) {
                Group.hasMany(models.User);
                Group.hasMany(models.GroupMsg);
            }
        }
    });
    return Group;
};
