import { web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { CheckExternal } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const authorizedSigner = await getSigner()
  const unauthorizedSigner = await getSigner()
  const { contractInstance: checkExternal } = await CheckExternal.deploy(authorizedSigner, {
    initialFields: { owner: authorizedSigner.address, value: 0n },
  })
  console.assert((await checkExternal.view.getValue()).returns === 0n)

  // Updating value with authorized signer
  await checkExternal.transact.setValue({ signer: authorizedSigner, args: { v: 1n } })
  console.assert((await checkExternal.view.getValue()).returns === 1n)

  // Trying to update value with unauthorized signer
  try {
    await checkExternal.transact.setValue({ signer: unauthorizedSigner, args: { v: 2n } })
  } catch {
    console.log('Could not update value with unauthorized signer.')
  }
  console.assert((await checkExternal.view.getValue()).returns === 1n)

  // Updating value with unauthorized signer using unsafe function
  await checkExternal.transact.setValueUnsafe({ signer: unauthorizedSigner, args: { v: 2n } })
  console.assert((await checkExternal.view.getValue()).returns === 2n)
}

test()