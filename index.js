const fs = require('fs');
const path = require('path');
const navigation = require('./navigation')

console.log('***************************************')
console.log('************** GROWX BOT **************')
console.log('***************************************')
console.log('************* Ctrl+C exit *************')
console.log('***************************************')
console.log('')
console.log(`-> Hi! I'm here to help you with your setup.`)

setup()
async function setup(){
    try{
        await handleKeychain()
        await navigation()
    }catch(e){throw e}
}

async function handleKeychain(){
    try{
        let keysdir = await fs.existsSync(path.resolve(__dirname,'../keychain'))
        if(!keysdir) await fs.mkdirSync(path.resolve(__dirname,'../keychain'))

        let keydir = await fs.existsSync(path.resolve(__dirname,'../keychain/keychain.json'))
        let gwxdir = await fs.existsSync(path.resolve(__dirname,'../keychain/growx-key.json'))
        if(!keydir){
            await fs.writeFileSync( path.resolve(__dirname,'../keychain/keychain.json'), '[]', 'utf8')
            console.log(`-> Created Keychain at ../keychain/keychain.json`)

            let oldkeydir = await fs.existsSync(path.resolve(__dirname,'../client-app-config/credentials.json'))
            if(oldkeydir){
                let oldkeychain = await fs.readFileSync( path.resolve(__dirname,'../client-app-config/credentials.json'), 'utf8')
                oldkeychain = JSON.parse(oldkeychain)
                let keychain = []
                Object.keys(oldkeychain).forEach(key=>{
                    keychain.push({
                        exchange: key,
                        keys: oldkeychain[key]
                    })
                })
                keychain = JSON.stringify(keychain,null,4)
                await fs.writeFileSync( path.resolve(__dirname,'../keychain/keychain.json'), keychain, 'utf8')
                console.log(`-> Imported old Keychain from ../client-app-config/credentials.json to ../keychain/keychain.json`)
            }
            keydir = true
        }
        if(!gwxdir){
            await fs.writeFileSync( path.resolve(__dirname,'../keychain/growx-key.json'), '{}', 'utf8')
            console.log(`-> Created GrowX key at ../keychain/growx-key.json`)

            let oldgwxdir = await fs.existsSync(path.resolve(__dirname,'../client-app-config/growx-bot.json'))
            if(oldgwxdir){
                let oldgwxkey = await fs.readFileSync( path.resolve(__dirname,'../client-app-config/growx-bot.json'), 'utf8')
                await fs.writeFileSync( path.resolve(__dirname,'../keychain/growx-key.json'), oldgwxkey, 'utf8')
                console.log(`-> Imported old GrowX key from ../client-app-config/growx-bot.json to ../keychain/growx-key.json`)
            }
            gwxdir = true
        }
        if(keydir && gwxdir){
            let keychain = await fs.readFileSync( path.resolve(__dirname,'../keychain/keychain.json'), 'utf8')
            keychain = JSON.parse(keychain)
            let gwxkey = await fs.readFileSync( path.resolve(__dirname,'../keychain/growx-key.json'), 'utf8')
            gwxkey = JSON.parse(gwxkey)
            console.log(`-> Keychain found, ${keychain.length} key(s) available`)
            gwxkey.token ? console.log(`-> GrowX keys found`) : console.log(`-> GrowX keys NOT found`)
        }
    }catch(e){throw e}
}