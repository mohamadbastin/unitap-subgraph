import {
  MultiWithdrawEthCall,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent
} from "../generated/Manager/Manager"
import { RoleAdminChanged, RoleGranted, RoleRevoked, Transaction, Batch } from "../generated/schema"

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

// multi whitdraw eth handler
export function handleMultiWithdrawEth(func: MultiWithdrawEthCall): void {
  // define a string
  let batchId: string = func.transaction.hash.toHexString()
  let batch = new Batch(
    batchId
  )
  batch.blockTimestamp = func.block.timestamp;
  batch.save()

  // for recipient in recipients
  func.inputs.recipients.forEach(r => {
    let transaction = new Transaction(
      batchId + (r.to.toHexString())
    )
    transaction.save()

    transaction.value = r.amount
    transaction.to = r.to
    transaction.batch = batchId
    transaction.save()
  });


}