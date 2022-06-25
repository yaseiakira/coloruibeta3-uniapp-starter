# coloruibeta3-uniapp-starter
Uniapp项目,集成了ColorUIBeta3,快速项目模板

## 使用
+ 1.`npm install`
+ 2.打开 HbuilderX,运行项目即可

## 主要目录说明
+ /app , 原先 colorUIBeta3 自带的目录, 可以在这里做一些定制,一些自定义组件,工具类, 配置类,store 等, 如接口地址配置,请求类
+ /ui , colorUIBeta3 自带的目录, 按该项目的原说明, 此处可以直接覆盖更新升级, 所以一般这里不要放自己的东西,如果需要调整其中的组件, 建议复制到 app 目录进行定制, 比如 /app/app-form-group 就是复制了 /ui/ui-form-group 进行调整的

## 其他说明
/app 和 /ui 中的 自定义组件都配置了 `easycom` 所以无需手动 import

## store 配置说明
+ 位置 `/app/store/index`
+ domain: 服务器接口域名, 不包括最后的 /
+ apiPath: 接口网关, 前后包含/, 如: /api/
+ loginPath : 登录页面Path, 请求遇到需要重新登录的情况会自动导航到登录页

+ 注意, domain 来自于 新的配置文件: `/app/config/baseurl-dev.js 开发环境接口域名` , `/app/config/baseurl-prod.js 生产环境接口域名`

+ responseMap: 自定义接口返回字段映射, 默认
```
{
	Success:'Success',
	Message:'Message',
	Data:'Data',
    NeedLogin: 'NeedLogin'
}
```

## 自定义 http
+ colorUIBeta3 /ui/js/request.js 已加入全局request, this.$request 即可使用
+ 基于上述request, 在 app/js/http.js 重新定义了一个 request
+ 使用: 
```
import http from '@/app/js/http.js'

http.request(url,data = {}, method = "GET", options = {
    loading:String | Boolean
    customApiPath: String,
    debug: Object | Boolean
})
```
+ 参数说明:

|名称   |说明   |示例   |
|-----|----|----|
|url   |接口地址,不包括域名和接口网关,域名和网关 在 /app/store 里面配置   | common/getUserInfo   |
| data | 请求参数 | {id:1}|
| method| GET 请求 还是 POST 请求| GET
|options| 选项参数 | {loading:true}|


+ options参数说明

|名称|说明|示例|
|----|----|----|
|loading| 是否显示全局的 loading 弹窗, 使用 uni.showLoading| true 或者任意字符串 , 如果不传, 则不会弹窗, 字符串值将会作为 弹窗的文本显示|
|customApiPath|自定义网关地址| /other/ , 最终的请求将会变成 `doman/other/common/getUserInfo`,否则就是默认的 `doman/api/common/getUserInfo` |
|debug|是否调试模式|传 true 或者其他 对象, 将不会实际请求服务器接口, 而是默认延迟1s后, 直接 resolve(debug), 适用于后端接口没提供(未写好), 但是又实际需要测试接口调用成功后的的前端交互逻辑的时候使用|

## 自定义上传
+ 使用: 
```
import http from '@/app/js/http.js'

http.upload(url,filePath,data = {},options = {
    onProgressUpdate:Function
    loading:String | Boolean
    customApiPath: String,
    debug: Object | Boolean
})

```

+ 参数说明:

|名称   |说明   |示例   |
|-----|----|----|
|url   |接口地址,不包括域名和接口网关,域名和网关 在 /app/store 里面配置   | common/upload   |
|filePath   | 要上传文件资源的路径, 来自 uni.chooseFile 或 uni.chooseImage  |
|options| 选项参数 | {loading:true}, 大多数参数同 http.request的options参数,详细说明参看下方|
| data | 请求参数 | {id:1}, 额外的上传参数 |


+ options参数说明

|名称|说明|示例|
|----|----|----|
|onProgressUpdate| 上传进度回调,参考 ![UniApp upload 文档](https://uniapp.dcloud.io/api/request/network-file.html) | |


## 自定义工具类,常用的从网上整理(copy)过来的一些前端js工具类
### 后面陆续更新一些
+ 定义在 `/app/js/ajutil.js`
+ 使用 `this.$ajutil.xxxx`
### 说明

```
// 将 日期字符串转换成 moment
this.$ajutil.stringToMoment(dateStr)

// 使用 moment 格式化日期
this.$ajutil.formatToDateTime(date, format)

// 对js数组进行去重
// 如 [{code:1,name:'test1'},{code:1,name:'test2'}]
// 返回 [{code:1,name:'test1'}]
this.$ajutil.uniqueArray(array, key = '')

// 将指定字符串截取, 超出 max 的用 ...替代
this.$ajutil.overflow(value, max = 100)

// 将字节数转换成 K,B,M,G
this.$ajutil.formatFileSize(size,pointLength)

// 将json字符串转换成json对象, 内部使用了 try catch, 不用担心报错
this.$ajutil.convertToJson(json, type = 'object|array')

// 常用正则表达式
this.$ajutil.commonRegex.xxxx
commonRegex 说明如下
phone : 手机号
password: 密码(6-12位)
code: 编号,不包含中文,空格
idCard:身份证号
decimal:带小数点数字
email:邮箱
video:常见视频文件扩展名
audio:常见音频文件扩展名
image:常见图片我呢见扩展名
url: 网址
windowsFile: windows下检测非法文件名
```