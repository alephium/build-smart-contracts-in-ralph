import { web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { Counter } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const signer = await getSigner()
  const { contractInstance: counter } = await Counter.deploy(signer, {
    initialFields: { counter: 0n },
  })

  console.assert((await counter.fetchState()).fields.counter === 0n)
  await counter.transact.increase({ signer })
  console.assert((await counter.fetchState()).fields.counter === 1n)
}

test()