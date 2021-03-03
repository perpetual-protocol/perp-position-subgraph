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
  position.margin = BigInt.fromI32(0)
  position.openNotional = BigInt.fromI32(0)
  position.tradingVolume = BigInt.fromI32(0)
  position.leverage = BigInt.fromI32(0)
  position.realizedPnl = BigInt.fromI32(0)
  position.unrealizedPnl = BigInt.fromI32(0)
  position.fundingPayment = BigInt.fromI32(0)
  position.fee = BigInt.fromI32(0)
  position.badDebt = BigInt.fromI32(0)
  position.liquidationPenalty = BigInt.fromI32(0)
  position.totalPnlAmount = BigInt.fromI32(0)
  position.blockNumber = BigInt.fromI32(0)
  position.timestamp = BigInt.fromI32(0)
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
  ammPosition.margin = BigInt.fromI32(0)
  ammPosition.positionSize = BigInt.fromI32(0)
  ammPosition.openNotional = BigInt.fromI32(0)
  ammPosition.tradingVolume = BigInt.fromI32(0)
  ammPosition.leverage = BigInt.fromI32(0)
  ammPosition.entryPrice = BigInt.fromI32(0)
  ammPosition.realizedPnl = BigInt.fromI32(0)
  ammPosition.unrealizedPnl = BigInt.fromI32(0)
  ammPosition.fundingPayment = BigInt.fromI32(0)
  ammPosition.fee = BigInt.fromI32(0)
  ammPosition.badDebt = BigInt.fromI32(0)
  ammPosition.liquidationPenalty = BigInt.fromI32(0)
  ammPosition.totalPnlAmount = BigInt.fromI32(0)
  ammPosition.position = parsePositionId(trader)
  ammPosition.blockNumber = BigInt.fromI32(0)
  ammPosition.timestamp = BigInt.fromI32(0)
  ammPosition.save()
  return ammPosition
}

export function parseAmmPositionId(amm: Address, trader: Address): string {
  return amm.toHexString() + "-" + trader.toHexString()
}

export function calcNewAmmOpenNotional(ammPosition: AmmPosition, event: PositionChanged): BigInt {
  let signedOpenNotional = ammPosition.positionSize.ge(BigInt.fromI32(0))
    ? ammPosition.openNotional
    : ammPosition.openNotional.neg()

  return signedOpenNotional
    .plus(event.params.realizedPnl)
    .plus(
      (event.params.exchangedPositionSize.ge(BigInt.fromI32(0)))
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
  amm.positionBalance = BigInt.fromI32(0)
  amm.openInterestSize = BigInt.fromI32(0)
  amm.openInterestNotional = BigInt.fromI32(0)
  amm.tradingVolume = BigInt.fromI32(0)
  amm.quoteAssetReserve = BigInt.fromI32(0)
  amm.baseAssetReserve = BigInt.fromI32(0)
  amm.blockNumber = BigInt.fromI32(0)
  amm.timestamp = BigInt.fromI32(0)
  amm.save()
  return amm
}

export function parseAmmId(ammAddress: Address): string {
  return ammAddress.toHexString()
}
