import fg from 'fast-glob'
import fs, { writeFileSync } from 'fs'
import path from 'path'
import isChinese from 'is-chinese'
import figlet from 'figlet'
import ora from 'ora'
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
}

function narrowing(content, file) {
  const singleLine = /\/\/(?!.*\..*\.).*\n/gm
  const multiLine = /\/\*(.|\r\n|\n)*?\*\//gm
  const html = /<!--([\s\S|\r]*?)-->/gm
  content = content.replace(singleLine, '')
    .replace(multiLine, '')
    .replace(html, '')
  return { content, file }
}

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
  url = path.resolve(url).split(ROOT)[1].replace(/\\/g,'/')
  result = { ...result, [url]: translateMap }
}

generateJsonStart()


