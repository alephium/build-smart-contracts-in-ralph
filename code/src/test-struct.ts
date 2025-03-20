import { getSigner } from '@alephium/web3-test'
import { Struct } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const struct = await Struct.deploy(signer, { initialFields: {} })
  await struct.contractInstance.view.test1()
  await struct.contractInstance.view.test2()
  await struct.contractInstance.view.test3()
}

test()