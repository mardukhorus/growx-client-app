const client = require('@growx/client')
const { rpc } = require('@growx/rpcs')
const crud = require('./crud')
const fs = require('fs');
const path = require('path');

const isvrpc = require('@growx/rpcs/package.json').version
const usvrpc = require('./package.json').dependencies['@growx/rpcs'].replace('^','')
const isvclient = require('@growx/client/package.json').version
const usvclient = require('./package.json').dependencies['@growx/client'].replace('^','')

let alert
const init = async ()=>{
    try{
        if(!alert){
            console.log('GrowX BOT launched!!!')
            alert = true
        }
        let growxKey = await fs.readFileSync( path.resolve(__dirname,'../keychain/growx-key.json'), 'utf8')
        growxKey = JSON.parse(growxKey)
        let keychain = await fs.readFileSync( path.resolve(__dirname,'../keychain/keychain.json'), 'utf8')
        keychain = JSON.parse(keychain)
        let mykeys = []
        keychain.forEach(k=> mykeys.push([k.exchange,k.keys.apiKey]))


        let instructions = await client.getInstructions(growxKey,mykeys)
        let crudins = []
        let clientins = []
        instructions.forEach(ins => {
            ins.keychain ? crudins.push(ins) : clientins.push(ins)
        });
        let clientres = await client.executeInstructions(rpc,keychain,clientins)
        let crudres = await crud.exe(crudins)
        let results = [...clientres,...crudres]
        let report = await client.reportResults(growxKey,results,[
            {package:'rpcs',version:isvrpc},{package:'client',version:isvclient}
        ])
    }catch(e){
        console.log(e)
    }
    setTimeout(()=>{
        init()
    },10e3)
}
const version_control = ()=>{
    return isvrpc==usvrpc&&isvclient==usvclient
}
const startCron = ()=>{
    version_control()
    ?init()
    :console.log('Versioning issue, please update with "npm update"')
}
module.exports = ()=>{
    startCron()
}