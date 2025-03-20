import { getSigner } from '@alephium/web3-test'
import { ByteVec } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const bytevec = await ByteVec.deploy(signer, { initialFields: {} })
  await bytevec.contractInstance.view.test()
}

test()