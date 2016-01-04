
0.替换res文件！！！！！

1.生成证书命令
keytool -genkey -v -keystore miaoBill.keystore -alias miaoBill -keyalg RSA -validity 365

2.在apk包中，找到META-INF ，删除之

3.输入命令,生成apk
jarsigner -keystore miaoBill.keystore -digestalg SHA1 -sigalg MD5withRSA MainActivity-debug-unaligned.apk miaoBill