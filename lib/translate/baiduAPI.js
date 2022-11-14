import fs from "fs"
import path from "path"
import request from "request"
import ora from 'ora'
import md5 from 'md5'
import chalk from "chalk"
import urlencode from "urlencode"
import {ROOT, LANG, CTX} from '../../constant/index.js'
import {exit} from "process"

const baseurl = "https://fanyi-api.baidu.com/api/trans/vip/translate"
const appid = CTX.appid
const salt = 'seemrcola'
const apikey = CTX.apikey
const toLang = CTX.to || LANG

if (!appid) console.log(`
  appid ERROR: ${chalk.red('can not found baidu appid')} \n
  suggest: http://api.fanyi.baidu.com/product
`)
if (!apikey) console.log(`
  apikey ERROR: ${chalk.red('can not found baidu apikey')} \n
  suggest: http://api.fanyi.baidu.com/product
`)
if (!appid || !apikey) exit(1)

// http://api.fanyi.baidu.com/doc/21
// sign = 按照 appid+q+salt+密钥的顺序拼接得到字符串 1
// 对字符串 1 做 MD5 ，得到 32 位小写的 sign。

export async function requestBaidu() {
    let c2xJson = fs.readFileSync(path.join(ROOT, 'c2x.index.json'), {encoding: 'utf-8'})
    c2xJson = JSON.parse(c2xJson)
    const keys = Object.keys(c2xJson)

    for (let name of keys) {
        let valueNames = Object.keys(c2xJson[name])
        const spinner = ora({
            text: `generate json ...`,
            color: "yellow",
        })

        spinner.start(`translating:${name}\n`)
        for (let valuename of valueNames) {
            let sign = md5(`${appid}${valuename}${salt}${apikey}`)
            await request(
                {url: `${baseurl}?q=${urlencode(valuename)}&from=zh&to=${toLang}&appid=${appid}&salt=${salt}&sign=${sign}`},
                (error, _, body) => {
                    if (error)
                        return console.log(`Translate word : ${chalk.red(error)}.\n`)
                    const translateResult = JSON.parse(body).trans_result[0].dst
                    console.log(`translate: ${valuename} => ${translateResult}\n`)
                    c2xJson[name][valuename] = translateResult
                }
            )
            // api limit QPS 1
            await new Promise((resolve) => setTimeout(() => resolve(), 1500))
        }
        spinner.succeed(`Finish: ${name}\n`)
    }
    return c2xJson
}





