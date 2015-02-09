

# API Docs
##简介
该文档为Siyee旗下的产品`Jackfruit`的API文档，该项目和文档均在开发中，当前依旧有许多不完善之处，仅供移动端开发者参考。如有疑问，请咨询`wlj0427@gmail.com`

*说明*

- URL中加粗的大写单词为REST请求的类型，其后所接的字符串为API路由 如`POST signup`中，POST为请求类型，/signup为请求链接
- Field中为PUT或POST请求中Body体中的参数，其中name为斜体的参数为必填。
- Parameters中为附带在URL中得参数。

##用户模块
----
###注册
####URL
**POST** /signup
####Fields
|Name|Description|remark|
|:--|:--|:--|
|*username*|用户名，全局唯一|无|
|*password*|密码|支持特殊字符，长度需要在8位以上|
|*email*|电子邮箱|暂未提供验证功能|
####Parameters
|Name|Description|remark|
|:--|:--|:--|
||||
####Demo Request
```
POST /auth/signup HTTP/1.1
Host: localhost:3000
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

username=Siyee-5&password=siyeegogogo&email=siyee%40siyee.org
```

####Demo Resopnse
```
{
    "result": {
        "statusCode": 0,
        "message": "OK!"
    },
    "user": {
        "__v": 0,
        "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1aWQiOiJGRkJGMkU0OS0yQTIzLTRDODUtQjU4My05RjRGQ0MwRUZFNUIiLCJleHAiOiIyMDE1LTAyLTA5VDAyOjE1OjUxLjg3MFoifQ.FMRy_f-URrvmGbvIlKBHPR_5XtmqVGm7M04yaxri30VuvRSkgoGtf4dZXKf_mCwq_3cRIyL55O27rbvCz11TyA",
        "guid": "FFBF2E49-2A23-4C85-B583-9F4FCC0EFE5B",
        "displayName": "Siyee-5",
        "provider": "local",
        "username": "Siyee-5",
        "_id": "54d8185752af91d312068b6b",
        "friends": [],
        "friendsCategory": [
            "normalFriend",
            "blacklist"
        ],
        "created": "2015-02-09T02:15:51.854Z",
        "roles": [
            "user"
        ],
        "avatarUrl": "img/default-avatar-icon.png",
        "email": "siyee@siyee.org",
        "lastName": "",
        "firstName": ""
    }
}
```

###登录
####URL
**POST** /signin
####Fields
|Name|Description|remark|
|:--|:--|:--|
|*username*|用户名||
|*password*|密码||
####Parameters
|Name|Description|remark|
|:--|:--|:--|
||||
####Demo Request
```
POST /auth/signin HTTP/1.1
Host: localhost:3000
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

username=siyee&password=siyeegogogo
```

####Demo Resopnse
```
{
    "result": {
        "statusCode": 0,
        "message": "OK!"
    },
    "user": {
        "_id": "54d8185752af91d312068b6b",
        "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1aWQiOiJGRkJGMkU0OS0yQTIzLTRDODUtQjU4My05RjRGQ0MwRUZFNUIiLCJleHAiOiIyMDE1LTAyLTA5VDAyOjE1OjUxLjg3MFoifQ.FMRy_f-URrvmGbvIlKBHPR_5XtmqVGm7M04yaxri30VuvRSkgoGtf4dZXKf_mCwq_3cRIyL55O27rbvCz11TyA",
        "guid": "FFBF2E49-2A23-4C85-B583-9F4FCC0EFE5B",
        "displayName": "Siyee-5",
        "provider": "local",
        "username": "Siyee-5",
        "__v": 0,
        "friends": [],
        "friendsCategory": [
            "normalFriend",
            "blacklist"
        ],
        "created": "2015-02-09T02:15:51.854Z",
        "roles": [
            "user"
        ],
        "avatarUrl": "img/default-avatar-icon.png",
        "email": "siyee@siyee.org",
        "lastName": "",
        "firstName": ""
    }
}
```
###修改个人信息
####URL
**PUT** /users/
####Fields
|Name|Description|remark|
|:--|:--|:--|
|displayName|昵称，用于显示||
|phoneNumber|电话号码||
|avatarUrl|头像地址|拟使用七牛进行存储|
|specificSign|个人签名||
|address|地址|暂不需要|
|gender|性别||
|hobby|||
|job|||
|birthday|||
|selfDescription|||
|school|||
|bloodType|||
####Parameters
|Name|Description|remark|
|:--|:--|:--|
||||
####Request
```
POST /auth/signup HTTP/1.1
Host: localhost:3000
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

username=Siyee-5&password=siyeegogogo&email=siyee%40siyee.org
```
####Resopnse
```
{
    "result": {
        "statusCode": 0,
        "message": "OK!"
    },
    "user": {
        "__v": 0,
        "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1aWQiOiJGRkJGMkU0OS0yQTIzLTRDODUtQjU4My05RjRGQ0MwRUZFNUIiLCJleHAiOiIyMDE1LTAyLTA5VDAyOjE1OjUxLjg3MFoifQ.FMRy_f-URrvmGbvIlKBHPR_5XtmqVGm7M04yaxri30VuvRSkgoGtf4dZXKf_mCwq_3cRIyL55O27rbvCz11TyA",
        "guid": "FFBF2E49-2A23-4C85-B583-9F4FCC0EFE5B",
        "displayName": "Siyee-5",
        "provider": "local",
        "username": "Siyee-5",
        "_id": "54d8185752af91d312068b6b",
        "friends": [],
        "friendsCategory": [
            "normalFriend",
            "blacklist"
        ],
        "created": "2015-02-09T02:15:51.854Z",
        "roles": [
            "user"
        ],
        "avatarUrl": "img/default-avatar-icon.png",
        "email": "siyee@siyee.org",
        "lastName": "",
        "firstName": ""
    }
}
```


##好友模块
----
仍在努力中...