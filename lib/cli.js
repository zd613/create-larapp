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

async function downloadLaravelProject(projectName){

    const url=`https://laravel.build/${projectName}`
    // let buildSh="";
    const text=await axios.get(url,{
    }).then(res=>res.data);
    
    fs.writeFileSync("./download.sh",text,{
        encoding:"utf-8"
    })
    console.log("ファイルダウンロードdone")
    console.log("ダウンロードスタート")
    
    // const child=spawn("powershell.exe")
    // child.stdout.on("data",(data)=>{
    //     console.log("PowerShell data: "+data)
    // })
    // child.stderr.on("data",(data)=>{
    //     console.log("power shell errors:"+data)
    // })
    // child.on("exit",()=>{
    //     console.log("powershell finished")
    // })
    // child.stdin.end();
    
    const currentWorkingDirectory=(process.cwd()).replace(/\\/g ,'/').replace(/:\//g,'/')
    console.log(currentWorkingDirectory)
    
    const a="/mnt/"+currentWorkingDirectory
    
    
    // const username=path.basename(os.homedir())
    // const cwd=`/mnt/c/Users/${username}/Documents/test`
    const cwd=a.toLowerCase()
    
    console.log("cwd:"+cwd)
    
    const child=spawn(`wsl.exe cd ${cwd} ; wsl.exe bash download.sh`,
        {shell:"powershell.exe",stdio: "inherit", stdin: "inherit",stderr:"inherit" });
    // child.stdout.on("data",data=>{
    //     console.log("Powershell data:"+data)
    // })
    // child.stdin.on("close",()=>{
    //     console.log("CLOSE")
    // })
    // child.stdin.pipe(process.stdin)
    // child.stderr.on("data",data=>{
    //     console.error(data.toString());
    // })
    
    // .on("data",data=>{
    //     console.error("ERROR occured")
    //     console.log("powershell error : "+data)
    //     process.stderr
    // })
    // child.stderr.pipe(process.stderr);
    child.on("exit",()=>{
        console.log("終了")
    })
    
    child.on("close",code=>{
        if (code !== 0) {
            console.error(`exited with code ${code}`)
          }
        console.log("done")
    })
    
    // 入力などできないの対応したい
    // ダウンロード時の表示もされてない？
    // TODO: https://stackoverflow.com/questions/28638008/node-js-how-to-show-stdin-input-with-child-process-exec
    // exec('wsl.exe bash a.sh',{shell:"powershell.exe"},function(err,stdout,stderr){
    //     console.log(err)
    //     console.log(stdout)
    //     console.log(stderr)
    
    //     console.log("done")
    // })
}