import { MAP_ENTRY_DEPOSIT, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { Counters } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const signer = await getSigner()
  const { contractInstance: counters } = await Counters.deploy(
    signer, { initialFields: {} }
  )

  async function getCurrentCount() {
    const { returns } = await counters.view.currentCount(
      { args: { key: signer.address } }
    )
    return returns
  }

  console.assert(await getCurrentCount() === 0n);
  await counters.transact.create({ signer, attoAlphAmount: MAP_ENTRY_DEPOSIT })
  console.assert(await getCurrentCount() === 1n)
  await counters.transact.increase({ signer })
  console.assert(await getCurrentCount() === 2n)
  await counters.transact.clear({ signer })
  console.assert(await getCurrentCount() === 0n);
}

test()