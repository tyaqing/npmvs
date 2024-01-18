# Npm VS
一个用来比较npm包的工具网站
[npmvs](https://vs.abfree.com/)
<img width="1213" alt="image" src="https://user-images.githubusercontent.com/11229306/172084825-c3ee1e7e-1a03-400b-991f-0b6d19e2f529.png">

## 功能
- 比较多个npm包的下载趋势
- 获取多个npm包的star、issue等基本信息
- 获取对比截图
- 获得相关包推荐(暂不完善)

## 技术栈
|库|功能|
|-|-|
|vue3|MVVM|
|g2plot|数据可视化|
|clipboard|复制库|
|pinia|状态管理|
|html2canvas|html转图片|
|vue-router|管理路由|

## 如何开发

### 安装依赖

> 使用pnpm来管理包

```bash
pnpm i
```

### 调试
```bash
pnpm dev
```
### 打包
```bash
pnpm build
```
### 部署
网站的线上环境是使用腾讯云web托管(没有接广告🐶),确实好用,省事儿.
[Web应用托管_Web服务托管_Web网站托管](https://cloud.tencent.com/product/webify)

### 后端部分
后端只是做了代理转发和redis缓存部分数据,没有啥技术含量,等脱敏后开源吧