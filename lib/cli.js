#!/usr/bin/env node
import axios from "axios"
import {spawn} from "child_process"
import fs from "fs"
import {cac} from "cac"

const cli=cac()
cli.option('--name [name]','Laravel Project Name',{
    default:'example-app'
})

cli.help()

const parsed=cli.parse()
console.log(JSON.stringify(parsed,null,2))

await downloadLaravelProject(parsed.options.name)

async function downloadLaravelProject(projectName){
    const url=`https://laravel.build/${projectName}`
    const text=await axios.get(url,{
    }).then(res=>res.data);
    
    fs.writeFileSync("./download.sh",text,{
        encoding:"utf-8"
    })
    console.log("ファイルダウンロードdone")
    console.log("ダウンロードスタート")
    
    const currentWorkingDirectory=(process.cwd()).replace(/\\/g ,'/').replace(/:\//g,'/')
    console.log(currentWorkingDirectory)
    
    const a="/mnt/"+currentWorkingDirectory
    
    
    // const username=path.basename(os.homedir())
    // const cwd=`/mnt/c/Users/${username}/Documents/test`
    const cwd=a.toLowerCase()
    
    console.log("cwd:"+cwd)
    
    const child=spawn(`wsl.exe cd ${cwd} ; wsl.exe bash download.sh`,
        {shell:"powershell.exe",stdio: "inherit", stdin: "inherit"});
    child.on("exit",()=>{
        console.log("終了")
    })
    
    child.on("close",code=>{
        if (code !== 0) {
            console.error(`exited with code ${code}`)
          }
        console.log("done")
    })
}