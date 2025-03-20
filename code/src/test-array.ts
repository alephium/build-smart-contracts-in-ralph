import { getSigner } from '@alephium/web3-test'
import { Array } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const array = await Array.deploy(signer, { initialFields: {} })
  await array.contractInstance.view.test()
}

test()