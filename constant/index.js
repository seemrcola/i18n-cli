import {cwd} from 'process'
import fs from 'fs'
import path from 'path'

export const ROOT = cwd()

export const PKG = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'package.json'), {encoding: 'utf-8'})
)

export const CTX = PKG.ctx

export const FILESTYPE = ['js', 'ts', 'vue']

export const IGNORE = []

export const PATH = 'src'

export const LANG = 'en'

export const EXPORT_JSON_NAME = 'c2x.index.json'

