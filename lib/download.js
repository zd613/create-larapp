import axios from "axios"
import {spawn} from "child_process"
import fs from "fs"
import {dirname,join} from "path"
import {fileURLToPath} from "url"

function toWsl2Path(path){
    console.log("path")
    console.log(path)

    const newPath= "/mnt/"+path.replace(/\\/g ,'/').replace(/:\//g,'/')
    return newPath.toLowerCase()
}

async function downloadLaravelProject(projectName){
    const url=`https://laravel.build/${projectName}`
    const text=await axios.get(url,{
    }).then(res=>res.data);

    console.log(dirname(fileURLToPath(import.meta.url)))
    
    const scriptPath=join(dirname(fileURLToPath(import.meta.url)),"download.sh")
    fs.writeFileSync(scriptPath,text,{
        encoding:"utf-8"
    })


    const cwd=toWsl2Path(process.cwd())
    console.log("cwd(lower case):"+cwd)
    const wslScriptPath=toWsl2Path(scriptPath)
    console.log("script path:"+wslScriptPath)
    const child=spawn(`wsl.exe cd ${cwd} ; wsl.exe bash ${wslScriptPath}`,
        {shell:"powershell.exe",stdio: "inherit", stdin: "inherit"});
    child.on("exit",()=>{
        //終了
    })
    
    child.on("close",code=>{
        if (code !== 0) {
            console.error(`exited with code ${code}`)
        }
    })
}

export {downloadLaravelProject}