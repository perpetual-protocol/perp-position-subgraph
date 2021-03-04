import {
  FundingRateUpdated,
  ReserveSnapshotted
} from "../../generated/AmmBTCUSDC/Amm"
import {
  FundingRateUpdatedEvent,
} from "../../generated/schema"
import {getAmm} from "./helper";

/* Funding rate/payment event
 */
export function handleFundingRateUpdated(event: FundingRateUpdated): void {
  let entity = new FundingRateUpdatedEvent(event.transaction.hash.toHexString() + "-" + event.logIndex.toString())
  entity.amm = event.address
  entity.rate = event.params.rate
  entity.underlyingPrice = event.params.underlyingPrice
  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.save()
}

export function handleReserveSnapshotted(event: ReserveSnapshotted): void {
  let amm = getAmm(event.address)
  let baseAssetReserve = event.params.baseAssetReserve
  let quoteAssetReserve = event.params.quoteAssetReserve
  amm.baseAssetReserve = baseAssetReserve
  amm.quoteAssetReserve = quoteAssetReserve
  amm.openInterestNotional = amm.openInterestSize.times(quoteAssetReserve.div(baseAssetReserve))
  amm.blockNumber = event.block.number
  amm.timestamp = event.block.timestamp
  amm.save()
}
