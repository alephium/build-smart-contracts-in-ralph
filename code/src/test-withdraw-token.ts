import { ONE_ALPH, web3 } from '@alephium/web3'
import { getSigner, mintToken } from '@alephium/web3-test'
import { WithdrawToken } from '../artifacts/ts'

async function test() {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')
  const nodeProvider = web3.getCurrentNodeProvider()

  const signer = await getSigner()
  const { contractInstance: withdrawToken } = await WithdrawToken.deploy(signer, {
    initialFields: {},
    initialAttoAlphAmount: ONE_ALPH,
    issueTokenAmount: 10n
  })

  await withdrawToken.transact.withdraw({ signer })

  async function getBalance(address: string) {
    return await nodeProvider.addresses.getAddressesAddressBalance(address)
  }
  const signerBalance = await getBalance(signer.address)
  console.assert(signerBalance.tokenBalances![0].amount === "1")
  const contractBalance = await getBalance(withdrawToken.address)
  console.assert(contractBalance.tokenBalances![0].amount === "9")
}

test()