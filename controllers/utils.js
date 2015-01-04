

exports.convertFullInfo=function (user) {
    delete user.dataValues.password;
    delete user.dataValues.GroupsUser;
    return user;
}

exports.convertSummaryInfo=function (user) {
    delete user.dataValues.phone;
    delete user.dataValues.password;
    delete user.dataValues.GroupsUser;
    return user;
}

