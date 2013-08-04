PSD2CssSprite
=============

一个PSD脚本，用于PSD生成CssSprite

## 目的
将PSD中的图片信息自动生成CssSprite,将原本的手工工作自动化。

## 安装
将代码clone到本地，将PSD2CssSprite文件夹copy至PhotoShop安装目录下的/Presets/Scripts文件夹。

若此时PhotoShop是打开状态，需要进行重启。

在“帮助”菜单下会新增一个PSD2CssSprite的功能。

## 使用
打开一PSD，然后点击"帮助"菜单下的“PSD2CssSprite”按钮，配置基本的参数，点击“OK”,变会自动执行。

产出物有三个：

* img:背景图片
* css:对应的背景图片css
* stylus:对应的背景图片stylus文件
* html:一个demo文件，便于查看图片与css的关系

## 规则
* 每个图片对应一个单独的PSD图层
* CssSprite的每个图片的class名取自对应PSD图层的名(名字中不能带有空格)
* 只针对可见图层执行

## 系统要求
理论上需要PhosoShop CS5以上。

我的开发环境是Mac下的CS6,若碰到问题,请联系我。

## 感谢
该脚本是在[丽萍](http://weibo.com/u/1066132811)的第一版基础上优化(退化？)而来。

# 版本
2013.7.9 完成第一个版本
2013.8.4 增加生成stylus文件

