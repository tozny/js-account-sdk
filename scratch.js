const { Account } = require('./src')
const { Sodium } = require('tozny-node-sdk')

async function doIt() {
  try{
    const em = `luke-${Date.now().toString()}@tozny.com`
    console.log(em)
    const conn = new Account(Sodium, 'http://platform.local.tozny.com:8000')
    const client = await conn.register('Fun times', em, '1LiketheSDK!')
    // const client = await conn.login('luke-1566193568447@tozny.com', '1LiketheSDK!')
    return client
  } catch(e) {
    console.error(e.stack)
  }
}

doIt().then(c => {
  console.log(c)
  const serial = c.client ? c.client.serialize() : c.serialize()
  console.log(JSON.stringify(serial))
})
