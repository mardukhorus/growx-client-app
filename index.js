const client = require('@growx/client')
const { rpc } = require('@growx/rpcs')
const growxMM = require('../client-app-config/growx-mm.json')
const credentials = require('../client-app-config/credentials.json')
const assets = require('../client-app-config/assets.json')

const init = async (growxMM,credentials,assets)=>{
    try{
        let instructions = await client.getInstructions(growxMM,assets)
        let results = await client.executeInstructions(rpc,credentials,instructions)
        client.reportResults(growxMM,results)
    }catch(e){
        console.log(e)
    }
    setTimeout(()=>{
        init(growxMM,credentials,assets)
    },10e3)
}

client.validateConfig(growxMM,credentials,assets)
? init(growxMM,credentials,assets)
: console.log('Config params did not pass validation, please revise!')