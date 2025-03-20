import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner } from '@alephium/web3-test'
import { Deposit, DepositTwice } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const nodeProvider = web3.getCurrentNodeProvider()

  const signer = await getSigner()
  const { contractInstance: deposit } = await Deposit.deploy(signer, {
    initialFields: {},
    initialAttoAlphAmount: ONE_ALPH,
  })

  await DepositTwice.execute(signer, {
    initialFields: {
      contract: deposit.contractId
    },
    attoAlphAmount: ONE_ALPH * 2n
  })

  const contractBalance = await nodeProvider.addresses.getAddressesAddressBalance(
    deposit.address
  )
  console.assert(BigInt(contractBalance.balance) === ONE_ALPH * 3n)
}

test()