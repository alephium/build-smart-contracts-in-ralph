import { getSigner } from '@alephium/web3-test'
import { AddressTest } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const address = await AddressTest.deploy(signer, { initialFields: {} })
  await address.contractInstance.view.test()
}

test()