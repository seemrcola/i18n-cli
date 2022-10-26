import fg from 'fast-glob'
import fs, { writeFileSync } from 'fs'
import path from 'path'
import isChinese from 'is-chinese'
import figlet from 'figlet'
import ora from 'ora'
import Json2xls from 'json2xls'
import { PKG, ROOT, FILESTYPE, PATH } from '../../constant/index.js'

/* constant */
const filesType = PKG.include || FILESTYPE
const startPath = PKG.path || PATH

/* generate result */
let result = {}

async function generateJsonStart() {
  figlet('generate json', async (err, data) => {
    if (err) return console.log(err)
    console.log(data)
    const all = await fg(`${startPath}/**/*.{${filesType.join()}}`, {
      absolute: true,
      stats: true,
    });
    generateJson(all)
  })
}

function generateJson(allFiles) {
  const spinner = ora({
    text: `generate json ...`,
    color: "yellow",
  })
  spinner.start()
  allFiles.forEach(file => {
    let content = fs.readFileSync(file.path, { encoding: 'utf-8' })
    let res = narrowing(content, file)
    scaner(res)
  })
  writeFileSync('c2x.index.json', JSON.stringify(result, null, 4), "utf-8")
  spinner.succeed()

  export2xls(result)
}

// delete /**/ & // & <!-- --> 
function narrowing(content, file) {
  const singleLine = /\/\/(?!.*\..*\.).*/gm
  const multiLine = /\/\*(.|\r\n|\n)*?\*\//gm
  const html = /<!--([\s\S|\r]*?)-->/gm
  content = content.replace(singleLine, '')
    .replace(multiLine, '')
    .replace(html, '')
  return { content, file }
}

// scaner
function scaner({ content, file }) {
  let i, len
  let scan = ""
  let translateMap = {}
  let coiled = false
  for (i = 0, len = content.length; i < len; i++) {
    if (isChinese(content[i])) {
      if (!coiled) coiled = true
      scan += content[i]
    }
    else {
      if (!coiled) continue
      translateMap[scan] = ""
      scan = ""
      coiled = false
    }
  }

  let url = file.path
  url = path.resolve(url).split(ROOT)[1].replace(/\\/g, '/')
  result = { ...result, [url]: translateMap }
}

function export2xls(json) {
  const resultJson = formatJson2Excel(json)
  console.log(resultJson)
  const xlsx = Json2xls(resultJson)
  fs.writeFileSync('translate.index.xlsx', xlsx, 'binary');
}

// c2x.index.js look like this
// { 
//   [path] : {
//      [any Chinese]:<empty>
//   }
// }
// transform to 
// [
//   {
//     "chinese": [any Chinese],
//     "english": [any English],
//     "path":  [path]
//   }
// ]

function formatJson2Excel(json) {
  const result = []
  const keys = Object.keys(json)
  for (let key of keys) { // `key` is path
    let obj = json[key]
    let objkeys = Object.keys(obj)
    let objvalues = Object.values(obj)

    if (objkeys.length == 0) continue

    let i, len, generateObj = {}
    for (i = 0, len = objkeys.length; i < len; i++) {
      generateObj['Path'] = key
      generateObj['VarName'] = "varName"
      generateObj['Chinese'] = objkeys[i]
      generateObj['English'] = objvalues[i]
    }
    result.push(generateObj)
    generateObj = {}
  }
  return result
}

generateJsonStart()


