import { web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { FunctionCalls, Fib } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  const signer = await getSigner()
  const { contractInstance: fib } = await Fib.deploy(signer, { initialFields: {} })
  const { contractInstance: functionCalls } = await FunctionCalls.deploy(
     signer,
     { initialFields: { fib: fib.contractId, result: 0n } }
  )
  await functionCalls.transact.runFib({ signer, args: { n: 10n } })

  const state = await functionCalls.fetchState()
  console.assert(state.fields.result === 55n)
}

test()