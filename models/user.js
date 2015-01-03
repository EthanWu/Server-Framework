"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    //reqired
    phone:DataTypes.STRING,
    password: DataTypes.STRING,
    nickname: DataTypes.STRING,
    sex: DataTypes.ENUM('male','female'),
    city:DataTypes.STRING,

    //non-required
    email:DataTypes.STRING,
    hobby:DataTypes.STRING,
    job:DataTypes.STRING,
    school:DataTypes.STRING,
    birthday:DataTypes.DATE,
    selfDesc:DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Group);
        User.hasMany(models.User, {as:'Friends'});
        User.hasMany(models.Letter, {as:'InLetters',foreignKey: 'in_user_has_id'});
        User.hasMany(models.Letter, {as:'OutLetters',foreignKey: 'out_user_has_id'});
        User.hasMany(models.MsgPrivate);
      }
    }
  });

  return User;
};
