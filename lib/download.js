import axios from "axios"
import {spawn} from "child_process"
import fs from "fs"
import {dirname} from "path"
import {fileURLToPath} from "url"

async function downloadLaravelProject(projectName){
    const url=`https://laravel.build/${projectName}`
    const text=await axios.get(url,{
    }).then(res=>res.data);
    
    fs.writeFileSync("./download.sh",text,{
        encoding:"utf-8"
    })
    
    const currentWorkingDirectory=(process.cwd()).replace(/\\/g ,'/').replace(/:\//g,'/')
    console.log("cwd:"+currentWorkingDirectory)
    
    const a="/mnt/"+currentWorkingDirectory
    

    const cwd=a.toLowerCase()
    console.log("cwd(lower case):"+cwd)
    console.log(dirname(fileURLToPath(import.meta.url)))
    
    const child=spawn(`wsl.exe cd ${cwd} ; wsl.exe bash download.sh`,
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