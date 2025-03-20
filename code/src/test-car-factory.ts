import {
    binToHex, stringToHex, tokenIdFromAddress, web3,
    MINIMAL_CONTRACT_DEPOSIT, NULL_CONTRACT_ADDRESS
  } from '@alephium/web3'
  import { getSigner } from '@alephium/web3-test'
  import { Car, CarFactory } from '../artifacts/ts'
  
  async function test() {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973')
    const nodeProvider = web3.getCurrentNodeProvider()
  
    const signer = await getSigner()
    const carInfos = { model: stringToHex('Toyota'), year: 2020n, price: 10000n }
  
    const { contractInstance: carTemplate } = await Car.deploy(signer, {
       initialFields: carInfos
    })
    const { contractInstance: carFactory } = await CarFactory.deploy(signer, {
       initialFields: { carAddress: NULL_CONTRACT_ADDRESS }
    })
  
    await carFactory.transact.createCar({
      signer,
      args: { carByteCode: Car.contract.bytecode, ...carInfos },
      attoAlphAmount: MINIMAL_CONTRACT_DEPOSIT
    })
  
    await carFactory.transact.copyCreateCar({
      signer,
      args: { carContractId: carTemplate.contractId, ...carInfos },
      attoAlphAmount: MINIMAL_CONTRACT_DEPOSIT
    })
  
    await carFactory.transact.copyCreateCarWithToken({
      signer,
      args: {
        carContractId: carTemplate.contractId,
        tokenAmount: 10000n,
        ...carInfos,
      },
      attoAlphAmount: MINIMAL_CONTRACT_DEPOSIT
    })
  
    const carAddress = (await carFactory.fetchState()).fields.carAddress
    const carTokenId = binToHex(tokenIdFromAddress(carAddress))
    const balance = await nodeProvider.addresses.getAddressesAddressBalance(carAddress)
    console.assert(
      balance.tokenBalances?.length === 1 &&
        balance.tokenBalances?.[0]?.id === carTokenId &&
        BigInt(balance.tokenBalances?.[0]?.amount) === 10000n
    )
  }
  
  test()