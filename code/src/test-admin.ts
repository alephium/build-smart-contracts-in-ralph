import { getSigner } from '@alephium/web3-test'
import { Admin, AdminTypes } from '../artifacts/ts'
import { sleep } from '@alephium/web3'

async function test() {
  const signer1 = await getSigner()
  const signer2 = await getSigner()
  const { contractInstance: admin } = await Admin.deploy(
    signer1, {
    initialFields: { admin: signer1.address }
  })

  let adminUpdatedEvent: AdminTypes.AdminUpdatedEvent | undefined
  admin.subscribeAdminUpdatedEvent({
    pollingInterval: 500,
    messageCallback: (event: AdminTypes.AdminUpdatedEvent): Promise<void> => {
      adminUpdatedEvent = event
      return Promise.resolve()
    },
    errorCallback: (error: any, subscription): Promise<void> => {
      console.log(error)
      subscription.unsubscribe()
      return Promise.resolve()
    }
  })

  await admin.transact.updateAdmin({ signer: signer1, args: { newAdmin: signer2.address } })
  await sleep(1000)

  console.assert(adminUpdatedEvent?.eventIndex === 0)
  console.assert(adminUpdatedEvent?.contractAddress === admin.address)
  console.assert(adminUpdatedEvent?.fields.previous === signer1.address)
  console.assert(adminUpdatedEvent?.fields.new === signer2.address)
  process.exit(0)
}

test()