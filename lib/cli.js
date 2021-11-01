#!/usr/bin/env node
import {cac} from "cac"
import { downloadLaravelProject } from "./download.js"

const cli=cac()
cli.option('--name [name]','Laravel Project Name',{
    default:'example-app'
})

cli.help()

const parsed=cli.parse()
console.log(JSON.stringify(parsed,null,2))

await downloadLaravelProject(parsed.options.name)