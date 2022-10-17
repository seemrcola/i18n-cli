#! /usr/bin/env node
import { program } from 'commander'
import { PKG } from '../constant/index.js'

/* add description */
program
  .option('-d --description', 'a cli for i18n')

program
  .command('export')
  .description('export Chinese')
  .action(() => {
    import('../lib/export/index.js')
  })

program
.command('translate')
.description('translate Chinese to English')
.action(() => {
    import('../lib/translate/index.js')
})

program
.command('replace')
.description('replace English to Chinese')
.action(() => {
    return console.log('功能仅为测试时的功能，不建议使用')
    import('../lib/replace/index.js')
})

/* add version */
program.version(PKG.version)

/* parse */
program.parse()
