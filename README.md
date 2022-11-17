# i18n-cli
export Chinese &amp; translate Chinese

#### install
```shell
pnpm add i18n-c2x-cli -g
```

#### usage:
```shell
ctx export
```
```shell
ctx translate // zh-cn to any
```

#### config
```json
//in package.json
"ctx": {
  // 这三个参数可查baidu翻译的接口文档，如果不需要翻译功能可以不填写
  "appid": "20221014001391302",
  "apikey": "efT1XJ_t9_9_V4MHPEDM",
  "to": "en",  //language

  "include": "",//包含哪些后缀的文件，默认 .js .vue .ts
  "path": "",   //文件路径，以该路径为根路径,读取全部文件，默认 'src'
  "ignore":[] //type string[] => fast-glob.config.ignore ; 忽略哪些文件。如 'src/main.js'
  }
  ```
