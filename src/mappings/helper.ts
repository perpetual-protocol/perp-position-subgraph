import { AmmPosition, Position, Amm } from "../../generated/schema"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { PositionChanged } from "../../generated/ClearingHouse/ClearingHouse"

export const BI_ZERO = BigInt.fromI32(0)

export function getPosition(trader: Address): Position {
  let position = Position.load(parsePositionId(trader))
  if (!position) {
    position = createPosition(trader)
  }
  return position!
}

export function createPosition(trader: Address): Position {
  let position = new Position(parsePositionId(trader))
  position.trader = trader
  position.margin = BI_ZERO
  position.openNotional = BI_ZERO
  position.tradingVolume = BI_ZERO
  position.leverage = BI_ZERO
  position.realizedPnl = BI_ZERO
  position.unrealizedPnl = BI_ZERO
  position.fundingPayment = BI_ZERO
  position.fee = BI_ZERO
  position.badDebt = BI_ZERO
  position.liquidationPenalty = BI_ZERO
  position.totalPnlAmount = BI_ZERO
  position.blockNumber = BI_ZERO
  position.timestamp = BI_ZERO
  position.save()
  return position
}

export function parsePositionId(trader: Address): string {
  return trader.toHexString()
}

export function getAmmPosition(amm: Address, trader: Address): AmmPosition {
  let ammPosition = AmmPosition.load(parseAmmPositionId(amm, trader))
  if (!ammPosition) {
    ammPosition = createAmmPosition(amm, trader)
  }
  return ammPosition!
}

export function createAmmPosition(amm: Address, trader: Address): AmmPosition {
  let ammPositionId = parseAmmPositionId(amm, trader)
  let ammPosition = new AmmPosition(ammPositionId)
  ammPosition.amm = amm
  ammPosition.trader = trader
  ammPosition.margin = BI_ZERO
  ammPosition.positionSize = BI_ZERO
  ammPosition.openNotional = BI_ZERO
  ammPosition.tradingVolume = BI_ZERO
  ammPosition.leverage = BI_ZERO
  ammPosition.entryPrice = BI_ZERO
  ammPosition.realizedPnl = BI_ZERO
  ammPosition.unrealizedPnl = BI_ZERO
  ammPosition.fundingPayment = BI_ZERO
  ammPosition.fee = BI_ZERO
  ammPosition.badDebt = BI_ZERO
  ammPosition.liquidationPenalty = BI_ZERO
  ammPosition.totalPnlAmount = BI_ZERO
  ammPosition.position = parsePositionId(trader)
  ammPosition.blockNumber = BI_ZERO
  ammPosition.timestamp = BI_ZERO
  ammPosition.save()
  return ammPosition
}

export function parseAmmPositionId(amm: Address, trader: Address): string {
  return amm.toHexString() + "-" + trader.toHexString()
}

export function calcNewAmmOpenNotional(ammPosition: AmmPosition, event: PositionChanged): BigInt {
  let signedOpenNotional = ammPosition.positionSize.ge(BI_ZERO)
    ? ammPosition.openNotional
    : ammPosition.openNotional.neg()

  return signedOpenNotional
    .plus(event.params.realizedPnl)
    .plus(
      (event.params.exchangedPositionSize.ge(BI_ZERO))
        ? event.params.positionNotional
        : event.params.positionNotional.neg()
    )
    .abs()
}

export namespace decimal {
  export function div(a: BigInt, b: BigInt): BigInt {
    return a.times(BigInt.fromI32(10).pow(18)).div(b)
  }
}


export function getAmm(ammAddress: Address): Amm {
  let amm = Amm.load(parseAmmId(ammAddress))
  if (!amm) {
    amm = createAmm(ammAddress)
  }
  return amm!
}

export function createAmm(ammAddress: Address): Amm {
  const amm = new Amm(parseAmmId(ammAddress))
  amm.address = ammAddress
  amm.positionBalance = BI_ZERO
  amm.openInterestSize = BI_ZERO
  amm.openInterestNotional = BI_ZERO
  amm.tradingVolume = BI_ZERO
  amm.quoteAssetReserve = BI_ZERO
  amm.baseAssetReserve = BI_ZERO
  amm.blockNumber = BI_ZERO
  amm.timestamp = BI_ZERO
  amm.save()
  return amm
}

export function parseAmmId(ammAddress: Address): string {
  return ammAddress.toHexString()
}
