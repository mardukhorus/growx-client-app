const client = require('@growx/client')
const { rpc } = require('@growx/rpcs')
const growxMM = require('../client-app-config/growx-bot.json')
const credentials = require('../client-app-config/credentials.json')

const isvrpc = require('@growx/rpcs/package.json').version
const usvrpc = require('./package.json').dependencies['@growx/rpcs'].replace('^','')
const isvclient = require('@growx/client/package.json').version
const usvclient = require('./package.json').dependencies['@growx/client'].replace('^','')

const init = async (growxMM,credentials)=>{
    try{
        let instructions = await client.getInstructions(growxMM)
        let results = await client.executeInstructions(rpc,credentials,instructions)
        let report = await client.reportResults(growxMM,results,[
            {package:'rpcs',version:isvrpc},{package:'client',version:isvclient}
        ])
    }catch(e){
        console.log(e)
    }
    setTimeout(()=>{
        init(growxMM,credentials)
    },10e3)
}
const version_control = ()=>{
    return isvrpc==usvrpc&&isvclient==usvclient
}
version_control()
?client.validateConfig(growxMM,credentials)
    ? init(growxMM,credentials)
    : console.log('Config params did not pass validation, please revise!')
:console.log('Versioning issue, please update with "npm update"')