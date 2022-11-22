const client = require('@growx/client')
const { rpc } = require('@growx/rpcs')
const server = require('./config/server.json')
const credentials = require('./config/credentials.json')
const assets = require('./config/assets.json')

const init = async (server,credentials,assets)=>{
    try{
        let instructions = await client.getInstructions(server,assets)
        let results = await client.executeInstructions(rpc,credentials,instructions)
        client.reportResults(server,results)
    }catch(e){
        console.log(e)
    }
    setTimeout(()=>{
        init(server,credentials,assets)
    },10e3)
}

client.validateConfig(server,credentials,assets)
? init(server,credentials,assets)
: console.log('Config params did not pass validation, please revise!')