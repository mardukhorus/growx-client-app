const { rpc } = require('@growx/rpcs')
//const { rpc } = require('../../rpcs')

let credentials = require('../../credentials.json')
let methods = [
    {method: 'fetchMarkets', params: []},
    {method: 'fetchOrderBook', params: ['symbol']},
    {method: 'fetchBalance', params: []},
    {method: 'createOrder', params: ['symbol','limit','side','quantity','price']},
    {method: 'fetchOpenOrders', params: ['symbol']},
    {method: 'cancelOrder', params: ['id','symbol']},
]
let dummy = {
    symbol: 'BTC/USDT',
    limit: 'limit',
    side: 'buy',
    price: null,
    quantity: null,
    id: null,
    usdt: 15
}

const test = async ()=>{
    try{
        let exchanges = Object.keys(credentials)
        console.log(`Found ${exchanges.length} exchanges: ${exchanges}`)
        await asyncForEach(exchanges, async exchange=>{
            await testMethods(exchange,credentials[exchange])
        })
    }catch(e){console.log(e)}
}
const testMethods = async (exchange,keys)=>{
    try{
        console.log(`Testing - ${exchange}`)
        exchange=='globiance'?dummy.symbol='BTC/EUR':dummy.symbol='BTC/USDT'
        let stop
        await asyncForEach(methods,async method=>{
            if(!stop){
                let params = []
                method.params.forEach(param => { params.push(dummy[param]) });
                let response = await rpc(exchange,keys)[method.method](...params)
                let valid = isValid(method.method,response)
                if(!valid)stop = true
                console.log({method: method.method,response: valid})
            }
        })
    }catch(e){console.log(e)}
}
const isValid = (method,response)=>{
    let valid = null
    let validations
    try{
        switch (method) {
            case 'fetchMarkets': 
                validations = 0
                if(Array.isArray(response)){
                    validations++
                    if(typeof response[0] == 'object'){
                        validations++
                        if(
                            Object.keys(response[0]).includes('id') &&
                            Object.keys(response[0]).includes('symbol') &&
                            Object.keys(response[0]).includes('precision')
                        ){
                            validations++
                        }else{console.log(`Response not including id/symbol/precision: ${method}.`)}
                    }else{console.log(`Response elements are not objects: ${method}.`)}
                }else{console.log(`Response is not array: ${method}.`)}
                validations == 3 ? valid = 'success' : ''
                break
            case 'fetchOrderBook': 
                validations = 0
                if(!Array.isArray(response)){
                    validations++
                    if(typeof response == 'object'){
                        validations++
                        if(
                            Object.keys(response).includes('asks') &&
                            Object.keys(response).includes('bids')
                        ){
                            validations++
                            if(
                                Array.isArray(response.asks) &&
                                Array.isArray(response.bids)
                            ){
                                validations++
                                if(
                                    Array.isArray(response.asks[0]) &&
                                    Array.isArray(response.bids[0])
                                ){
                                    validations++
                                    dummy.price = response.asks[0][0]/2
                                    dummy.quantity = dummy.usdt / dummy.price
                                }else{console.log(`Order format is not array of numbers: ${method}.`)}
                            }else{console.log(`Asks/bids are not arrays: ${method}.`)}
                        }else{console.log(`Response not including asks/bids: ${method}.`)}
                    }else{console.log(`Response is not object: ${method}.`)}
                }else{console.log(`Response is not object: ${method}.`)}
                validations == 5 ? valid = 'success' : ''
                
                break
            case 'fetchBalance':
                validations = 0
                if(typeof response == 'object'){
                    validations++
                    if(
                        Object.keys(response).includes('total')
                    ){
                        validations++
                    }else{console.log(`Response not including total: ${method}.`)}
                }else{console.log(`Response is not object: ${method}.`)}
                validations == 2 ? valid = 'success' : ''
                break
            case 'createOrder':
                validations = 0
                if(typeof response == 'object'){
                    validations++
                    if(
                        Object.keys(response).includes('id')
                    ){
                        validations++
                        dummy.id = response.id
                    }else{console.log(`Response not including id: ${method}.`)}
                }else{console.log(`Response is not object: ${method}.`)}
                validations == 2 ? valid = 'success' : ''
                break
            case 'fetchOpenOrders':
                validations = 0
                if(Array.isArray(response)){
                    validations++
                    if(typeof response[0] == 'object'){
                        validations++
                        if(
                            Object.keys(response[0]).includes('id') &&
                            Object.keys(response[0]).includes('symbol') &&
                            Object.keys(response[0]).includes('side') &&
                            Object.keys(response[0]).includes('price') &&
                            Object.keys(response[0]).includes('amount') &&
                            Object.keys(response[0]).includes('filled') &&
                            Object.keys(response[0]).includes('remaining')
                        ){
                            validations++
                        }else{console.log(`Response not including id/symbol/side/price/amount/filled/remaining: ${method}.`)}
                    }else{console.log(`Response elements are not objects: ${method}.`)}
                }else{console.log(`Response is not array: ${method}.`)}
                validations == 3 ? valid = 'success' : ''
                break
            case 'cancelOrder':
                validations = 0
                if(typeof response == 'object'){
                    validations++
                    if(
                        Object.keys(response).includes('id')
                    ){
                        validations++
                        dummy.id = response.id
                    }else{console.log(`Response not including id: ${method}.`)}
                }else{console.log(`Response is not object: ${method}.`)}
                validations == 2 ? valid = 'success' : ''
                break
            default:
              console.log(`Unknown method: ${method}.`);
          }
          
    }catch(e){console.log(e)}    
    return valid
}
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}



test()

