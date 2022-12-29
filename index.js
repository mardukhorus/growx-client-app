const client = require('@growx/client')
const { rpc } = require('@growx/rpcs')
const growxMM = require('../client-app-config/growx-bot.json')
const credentials = require('../client-app-config/credentials.json')

const init = async (growxMM,credentials)=>{
    try{
        let instructions = await client.getInstructions(growxMM)
        let results = await client.executeInstructions(rpc,credentials,instructions)
        let report = await client.reportResults(growxMM,results)
    }catch(e){
        console.log(e)
    }
    setTimeout(()=>{
        init(growxMM,credentials)
    },10e3)
}

client.validateConfig(growxMM,credentials)
? init(growxMM,credentials)
: console.log('Config params did not pass validation, please revise!')