import { getSigner } from '@alephium/web3-test'
import { Integer } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const integer = await Integer.deploy(signer, { initialFields: {} })
  await integer.contractInstance.view.test()
}

test()