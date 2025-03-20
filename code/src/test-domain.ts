import {
    addressFromContractId, stringToHex, subContractId,
    MINIMAL_CONTRACT_DEPOSIT
 } from '@alephium/web3'
 import { getSigner } from '@alephium/web3-test'
 import { Domain, SubDomain } from '../artifacts/ts'
 
 async function test() {
   const signer = await getSigner()
   const { contractInstance: subDomainTemplate } = await SubDomain.deploy(signer, {
      initialFields: { url: stringToHex('') }
   })
 
   const { contractInstance: domain } = await Domain.deploy(signer, {
      initialFields: {
         url: stringToHex('x.com'),
         subDomainTemplateId: subDomainTemplate.contractId
      }
   })
 
   await domain.transact.createSubDomain({
     signer,
     args: { subDomainUrl: stringToHex('home') },
     attoAlphAmount: MINIMAL_CONTRACT_DEPOSIT
   })
 
   const {returns: subDomainContractAddress} = await domain.view.getSubDomain({
     args: { subDomainUrl: stringToHex('home') }
   })
   const subDomainInstance = SubDomain.at(subDomainContractAddress)
   console.assert((await subDomainInstance.view.getUrl()).returns === stringToHex('x.com/home'))
 
   const subDomainContractId = subContractId(domain.contractId, stringToHex('home'), 0)
   console.assert(subDomainContractAddress === addressFromContractId(subDomainContractId))
 }
 
 test()