exports.SUCCESS = 0x000000;
exports.FAILED = 0x000001;
//signup
exports.INVALID_PHONE = 0x000010;
exports.INVALID_PASSWD = 0x000020;
exports.PHONE_REGISTERED = 0x000030;
exports.CREATE_USER_FAILED = 0x000040;
//login

exports.INVALID_PHONE_PASSWD=0x000050;
exports.ALREADY_LOGGED_IN=0x000055;
exports.NOT_REGISTERED=0x000060;
exports.WRONG_PASSWD=0x000070;
exports.UNAUTHORIZED=0x000080;

exports.INVALID_REQ = 0x000090;
exports.USER_NO_FOUND = 0x000100;

//group
exports.GROUP_NO_FOUND = 0x000110;
exports.GROUP_REQUEST_EXISTS = 0x000120;
exports.ADD_GROUP_REQUEST_FAILED = 0x000130;
exports.CREATE_GROUP_FAILED = 0x000140;
exports.GROUP_REQUEST_NOT_EXISTS = 0x000150;

//friend
exports.FRIEND_NO_FOUND = 0x000160;
exports.FRIEND_REQUEST_EXISTS = 0x000170;
exports.FRIEND_REQUEST_NOT_EXISTS = 0x000180;
exports.ADD_FRIEND_REQUEST_FAILED = 0x000190;

//letter
exports.LETTER_NO_FOUND = 0x000200;


exports.error = function (code, msg) {
    return createResult(code, false, null, msg);
}

exports.ok = function (code, data) {
    return createResult(code, true, data, null);
}

createResult = function (code, status, data, msg) {
    return {
        code: code,
        status: status,
        data: data,
        msg: msg,
        server_time: Date.now() / 1000
    };
}
exports.createResult = createResult;
