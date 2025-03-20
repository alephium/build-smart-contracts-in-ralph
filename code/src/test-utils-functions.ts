import { getSigner } from '@alephium/web3-test'
import { UtilsFunctions } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const utilsFunctions = await UtilsFunctions.deploy(signer, { initialFields: {} })
  await utilsFunctions.contractInstance.view.test()
}

test()