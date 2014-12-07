"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    nickname: DataTypes.STRING,
    email:DataTypes.STRING,
    phone:DataTypes.STRING,
    sex: DataTypes.ENUM('male','female'),
    nation:DataTypes.STRING,
    hobby:DataTypes.STRING,
    location:DataTypes.STRING,
    job:DataTypes.STRING,
    school:DataTypes.STRING,
    birthday:DataTypes.DATE,
    selfDesc:DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Group),
        User.hasMany(models.User, {as:'friends'}),
        User.hasMany(models.Letter)
      }
    }
  });

  return User;
};
