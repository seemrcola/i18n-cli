import fs from 'fs'
import figlet from 'figlet'
import chalk from 'chalk'
import {requestBaidu} from './baiduAPI.js'
import {EXPORT_JSON_NAME} from '../../constant/index.js'

async function translateJson() {
    figlet('translating', async (err, data) => {
        if (err) return console.log(err)
        console.log(data)

        const c2xJson = await requestBaidu()
        console.log(`Translate word : ${chalk.blue('finish all')}.`)

        fs.writeFileSync(EXPORT_JSON_NAME, JSON.stringify(c2xJson, null, 4), "utf-8")
    })
}

translateJson()
