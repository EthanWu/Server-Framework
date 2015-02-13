#Jackfruit v1.0特性列表（初稿待审阅）

##用户（个人信息）
*注：此处的用户指的是使用Jackfruit移动端软件的普通用户*

###注册
####通过手机号码
用户可通过使用手机号码获取验证码的方式进行注册
####通过用户名和邮箱注册
用户可以使用用户名和邮箱
####使用第三方账户一键注册
详见登录功能的**用第三方账号一键注册并登陆**
###登录
####使用邮箱登录
用户可使用用户名绑定的邮箱和密码登录
####使用手机号码
用户可使用用户名绑定的手机号和密码登录
####使用用户名登录
用户可使用用户名和密码登录

####用第三方账号一键注册并登录
第一阶段拟支持以下第三方账户：

`微博`、`微信`、`QQ`
###个人信息管理
####修改个人信息
用户可修改自己的个人信息，如头像、生日、年龄等
###密码管理
####修改密码
用户可通过指定验证（邮箱或手机号或密码验证）后修改自己的密码
####找回密码
用户可在密码丢失后申请找回密码，需要以绑定了邮箱为前提
###用户筛选
####搜索用户
用户可通过指定条件对来筛选用户，包括但不限于以下字段：`用户名`，`城市`，`性别`

###用户推荐
####系统推荐用户
系统可根据用户信息（如年龄，性别，所在城市等）向用户推荐其他用户。以便增进用户之间的联系和交流。

----

##好友

###添加好友
####发送好友申请
用户可通过**用户筛选**特性来搜索自己感兴趣的好友，并向其发送好友申请信息
####处理好友申请
用户对请求添加自己为好友的消息进行处处理，可接受、拒绝或忽略
###删除好友
####删除好友
用户可将好友从自己的好友列表中删除
###好友分组
用户可将好友按照组的方式来划分
####创建分组
创建一个好友分组
####删除分组
删除一个好友分组
####移至分组
用户可将好友添加至指定分组
###备注
####添加备注
用户可对已有的好友添加备注名
####修改备注
用户可修改好友的备注名称
####删除备注
用户可删除好友的备注名
###搜索好友
用户可通过指定关键字（用户名）在好友列表中搜索指定的好友

----

##私信
####发送私信
用户间可自由发送私信
####查看私信
用户可查看接收人为自己的私信
####回复私信
用户可回复发送给自己的私信

----

##群组
群组是用户结伴出行的基本单位，包含了一定数量的用户（由发起人设置），一条旅行路线和一份旅行计划，组内的用户可通过群聊的方式进行交流。
###查询群组
用户可通过指定条件（群组名，目的地，出发时间等）查询群组
###申请加入群组
用户可向指定群组发送申请加入的请求

###群组管理
####创建群组
任意用户均可自发创建群组
####编辑群组信息
发起人可修改当前群组的信息
####邀请好友加入群组
群组内用户可邀请好友加入群组
####处理群组申请
群组发起人可接收到入组申请，并进行处理（同意，拒绝，忽略）
####请出群组
发起人可将组内用户请出群组

###群聊
处在同一个群组的用户可以在群内与其他用户进行交流，支持文字、语音、图片等形式

----

##个人中心
个人中心中包含了用户较为详细的信息，如旅行过程中所拍的照片，所写下的游记等，为用户提供了一个展示自己的空间，同时使其他用户更好地了解自己。
###相册
####创建相册
用户可在个人中心中创建相册，以便管理自己在旅行过程中所拍的照片
####上传照片
用户可将照片上传至相册，并展示在个人中心
####删除照片
用户可删除已上传的照片
####删除相册
用户可删除已创建的相册
###游记
（1.0版本不涉及）
###状态
（1.0版本不涉及）
###收藏
####添加至收藏
用户可将自己所感兴趣的旅行线路或旅行计划收藏起来，方便今后参与。
###旅行记录
旅行记录是用户使用Jackfruit软件与好友结伴出行的记录，由系统自动生成
####查看旅行记录
用户可查看自己和他人的旅行记录

----

##系统通知
系统管理员可向用户发送系统通知，通知的类型分为：广播，组播
####广播
无差别地将信息推送给所有用户
####组播
给特定的用户群体发送通知，如某群组的用户，或所处位置在特定城市的用户等
####单播
向特定用户发送系统通知，如警告消息，中奖信息等

##支付（待讨论）
###通过支付宝支付

----

*以下特性需要调用旅行社提供的API来实现*
##旅行计划
##旅行路线
###路线推荐
###路线筛选

