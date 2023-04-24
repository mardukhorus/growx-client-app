const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();

async function notAvailable(option,funx){
    try{
        if(option){
            console.log(`-> Option [${option}] not available. Select available options or exit with Ctrl+C`)
            funx()
        }
    }catch(e){throw e}
}
async function navOptions(){
    try{
        let options = ['1','2','3']
        console.log('')
        console.log('1. Add/Edit/Show GrowX key')
        console.log('2. Add/Edit/Show Keychain')
        console.log('3. Launch/Reload/Update App instructions')
        console.log('')
        const option = prompt(`Input option number + Enter > `);
        options.includes(option) ? navSelection(option) : notAvailable(option,navOptions)
    }catch(e){throw e}
}
async function gwxOptions(){
    try{
        let options = ['0','1','2']
        console.log('')
        console.log('0. Main menu')
        console.log('1. Show GrowX key')
        console.log('2. Edit GrowX key')
        console.log('')
        const option = prompt(`Input option number + Enter > `);
        options.includes(option) ? gwxSelection(option) : notAvailable(option,gwxOptions)
    }catch(e){throw e}
}
async function keychainOptions(){
    try{
        let options = ['0','1','2','3','4']
        console.log('')
        console.log('0. Main menu')
        console.log('1. Show keys')
        console.log('2. Add key')
        console.log('3. Edit key')
        console.log('4. Delete key')
        console.log('')
        const option = prompt(`Input option number + Enter > `);
        options.includes(option) ? keychainSelection(option) : notAvailable(option,keychainOptions)
    }catch(e){throw e}
}
async function lruOptions(){
    try{
        let options = ['0']
        console.log('')
        console.log('* Launch GrowX app with pm2, exit with Ctrl+C then use command "pm2 start launcher.js --name growx" ')
        console.log('* Reload GrowX app with pm2, exit with Ctrl+C then use command "pm2 reload growx" ')
        console.log('* Read GrowX logs with pm2, exit with Ctrl+C then use command "pm2 logs growx" ')
        console.log('* Update GrowX app with git and pm2, exit with Ctrl+C then use commands "git pull" then "npm update" then "pm2 reload growx"')
        console.log('* To install pm2, exit with Ctrl+C then use command "npm i pm2 -g"')
        console.log('')
        console.log('0. Main menu')
        console.log('')
        const option = prompt(`Input option number + Enter > `);
        options.includes(option) ? navOptions() : notAvailable(option,lruOptions)
    }catch(e){throw e}
}
async function navSelection(option){
    try{
        console.log(`-> Selected [${option}]`)
        option == '1' ? await gwxOptions() : null
        option == '2' ? await keychainOptions() : null
        option == '3' ? await lruOptions() : null
    }catch(e){throw e}
}
async function gwxSelection(option){
    try{
        console.log(`-> Selected [${option}]`)
        option == '0' ? await navOptions() : null
        option == '1' ? await GwxKey.get() : null
        option == '2' ? await GwxKey.upd() : null
    }catch(e){throw e}
}
async function keychainSelection(option){
    try{
        console.log(`-> Selected [${option}]`)
        option == '0' ? await navOptions() : null
        option == '1' ? await Keychain.get() : null
        option == '2' ? await Keychain.add() : null
        option == '3' ? await Keychain.upd() : null
        option == '4' ? await Keychain.del() : null
    }catch(e){throw e}
}
async function keychainEditSelection(option,keychain){
    try{
        console.log(`-> Selected [${option}]`)
        option == '0' || !option ? await keychainOptions() : await Keychain.edit(option,keychain)
    }catch(e){throw e}
}
async function keychainDeleteSelection(option,keychain){
    try{
        console.log(`-> Selected [${option}]`)
        option == '0' || !option ? await keychainOptions() : await Keychain.delete(option,keychain)
    }catch(e){throw e}
}
const GwxKey = {
    get: async ()=>{
        let key = await fs.readFileSync( path.resolve(__dirname,'../../keychain/growx-key.json'), 'utf8')
        key = JSON.parse(key)
        key.token?console.log(key):console.log('GrowX key not found')
        gwxOptions()
    },
    upd: async ()=>{
        let key = await fs.readFileSync( path.resolve(__dirname,'../../keychain/growx-key.json'), 'utf8')
        key = JSON.parse(key)
        key.token?console.log(key):console.log('GrowX key not found')
        console.log('')
        const option = prompt(`Input new GrowX key + Enter > `)
        if(option){
            key.token = option
            key = JSON.stringify(key,null,4)
            await fs.writeFileSync( path.resolve(__dirname,'../../keychain/growx-key.json'), key, 'utf8')
            console.log('-> Updated GrowX key')
        }else{
            console.log('-> Aborted updating GrowX key')
        }
        gwxOptions()
    }
}
const Keychain = {
    get: async ()=>{
        let keychain = await fs.readFileSync( path.resolve(__dirname,'../../keychain/keychain.json'), 'utf8')
        keychain = JSON.parse(keychain)
        keychain.length?console.log(keychain):console.log('0 keys found')
        keychainOptions()
    },
    upd: async ()=>{
        let keychain = await fs.readFileSync( path.resolve(__dirname,'../../keychain/keychain.json'), 'utf8')
        keychain = JSON.parse(keychain)
        if(keychain.length){
            let cnt = 1
            console.log('')
            console.log('0. Back')
            keychain.forEach(key => {
                console.log(cnt+'.',key)
                cnt++
            });
            const option = prompt(`Input option number + Enter > `)
            if(option){
                keychainEditSelection(option,keychain)
            }
        }else{
            keychainOptions()
        }
    },
    edit: async (option,keychain)=>{
        let key = keychain[Number(option)-1]
        console.log('-> Editing',key)
        const exchange = prompt(`Input new exchange name or Enter to skip > `)
        if(exchange && typeof exchange == 'string') key.exchange = exchange
        await asyncForEach(Object.keys(key.keys),async cred=>{
            let newcred = prompt(`Input new ${cred} or Enter to skip > `)
            if(newcred && typeof newcred == 'string') key.keys[cred] = newcred
        })
        keychain[Number(option)-1] = key
        keychain = JSON.stringify(keychain,null,4)
        await fs.writeFileSync( path.resolve(__dirname,'../../keychain/keychain.json'), keychain, 'utf8')
        console.log('-> Editing done')
        keychainOptions()
    },
    add: async ()=>{
        let keychain = await fs.readFileSync( path.resolve(__dirname,'../../keychain/keychain.json'), 'utf8')
        keychain = JSON.parse(keychain)

        let key = {exchange:'',keys:{}}
        const exchange = prompt(`Input exchange name > `)
        if(exchange && typeof exchange == 'string'){
            key.exchange = exchange
            let apiKey = prompt(`Input apiKey > `)
            if(apiKey && typeof apiKey == 'string'){
                key.keys.apiKey = apiKey
                let secret = prompt(`Input secret > `)
                if(secret && typeof secret == 'string'){
                    key.keys.secret = secret
                    let additional = prompt(`Any additional parameter? (y/n) > `)
                    if(additional && additional == 'y'){
                        let param_name = prompt(`Input additional parameter name > `)
                        let param_value = prompt(`Input additional parameter value > `)
                        if(param_name && param_value && typeof param_value == 'string'){key.keys[param_name]=param_value}
                    }
                    keychain.push(key)
                    keychain = JSON.stringify(keychain,null,4)
                    await fs.writeFileSync( path.resolve(__dirname,'../../keychain/keychain.json'), keychain, 'utf8')
                    console.log('-> Key added')
                }
            }
                

        }
        keychainOptions()
    },
    del: async ()=>{
        let keychain = await fs.readFileSync( path.resolve(__dirname,'../../keychain/keychain.json'), 'utf8')
        keychain = JSON.parse(keychain)
        if(keychain.length){
            let cnt = 1
            console.log('')
            console.log('0. Back')
            keychain.forEach(key => {
                console.log(cnt+'.',key)
                cnt++
            });
            const option = prompt(`Input option number + Enter > `)
            if(option){
                keychainDeleteSelection(option,keychain)
            }
        }else{
            keychainOptions()
        }
    },
    delete: async (option,keychain)=>{
        keychain.splice(Number(option)-1,1)
        keychain = JSON.stringify(keychain,null,4)
        await fs.writeFileSync( path.resolve(__dirname,'../../keychain/keychain.json'), keychain, 'utf8')
        console.log('-> Key deleted')
        keychainOptions()
    }
}
module.exports =async ()=>{
    await navOptions()
}


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
  