import { binToHex } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { OldCode, NewCode } from '../artifacts/ts'

async function test() {
  const signer = await getSigner()
  const { contractInstance: oldCode } = await OldCode.deploy(signer, {
     initialFields: { owner: signer.address, n: 100n }
  })

  const {encodedImmFields, encodedMutFields} = NewCode.encodeFields({
    owner: signer.address, n: 200n
  })
  const immFields = binToHex(encodedImmFields)
  const mutFields = binToHex(encodedMutFields)
  await oldCode.transact.migrateWithFields({
    signer,
    args: { newCode: NewCode.contract.bytecode, immFields, mutFields }
  })

  const newContract = await NewCode.at(oldCode.address)
  const {returns: newN} = await newContract.view.get()
  console.assert(newN === 200n)

  await newContract.transact.set({signer, args: {m: 300n}})
  const {returns: newN2} = await newContract.view.get()
  console.assert(newN2 === 300n)

  await newContract.transact.destroy({signer})
}

test()
