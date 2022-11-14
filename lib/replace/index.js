import fs from 'fs'
import path from 'path'
import figlet from 'figlet'
import {ROOT, EXPORT_JSON_NAME} from '../../constant/index.js'

async function replaceStart() {
    figlet('replace start', async (err, data) => {
        if (err) return console.log(err)
        console.log(data)

        let c2xJson = fs.readFileSync(path.join(ROOT, EXPORT_JSON_NAME), {encoding: 'utf-8'})
        c2xJson = JSON.parse(c2xJson)
        const keys = Object.keys(c2xJson)
        replace(keys, c2xJson)
    })
}

async function replace(keys, obj) {
    for (let key of keys) {
        let obsolutePath = path.join(ROOT, key)
        let content = fs.readFileSync(obsolutePath, {encoding: 'utf-8'})
        let names = Object.keys(obj[key])
        names.sort((a, b) => b.length - a.length)

        for (let name of names) {
            let reg = new RegExp(`${name}`, 'g')
            content = content.replace(reg, obj[key][name])
        }
        fs.writeFileSync(obsolutePath, content)
    }
}

replaceStart()
