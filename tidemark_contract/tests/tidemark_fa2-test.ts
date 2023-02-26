

import * as att from "@completium/archetype-ts-types";
import { ArchetypeType, Rational, Duration, date_cmp, Tez, Bytes, Address, Nat, Enum, CallResult } from '@completium/archetype-ts-types';
import { tidemark_fa2} from './binding/tidemark_fa2'
import {get_account, set_mockup, set_mockup_now, set_quiet, Account, delay_mockup_now_by_minute, delay_mockup_now_by_week, delay_mockup_now_by_second} from "@completium/experiment-ts";
import { expect_to_fail } from '@completium/experiment-ts';
import { BigNumber } from 'bignumber.js'
const assert = require('assert')
const readline = require('readline');
/* Accounts ---------------------------------------------------------------- */

const creator_one = get_account('creator_one')
const owner_one = get_account('owner_one')
const owner_two = get_account('owner_two')
const owner_three = get_account('owner_three')
const owner_four = get_account('owner_four')
const owner_five = get_account('owner_five')
const owner_six = get_account('owner_six')
const collector_one = get_account('collector_one')
const collector_two = get_account('collector_two')
const collector_three = get_account('collector_three')
const marketplace_one = get_account('marketplace_one')
const marketplace_two = get_account('marketplace_two')
const marketplace_three = get_account('marketplace_three')
const minter_one = get_account('minter_one')
const minter_two = get_account('minter_two')
const minter_three = get_account('minter_three')

const creator_one_address = creator_one.get_address()
const owner_one_address = owner_one.get_address()
const owner_two_address = owner_two.get_address()
const owner_three_address = owner_three.get_address()
const owner_four_address = owner_four.get_address()
const owner_five_address = owner_five.get_address()
const owner_six_address = owner_six.get_address()
const collector_one_address = collector_one.get_address()
const collector_two_address = collector_two.get_address()
const collector_three_address = collector_three.get_address()
const marketplace_one_address = marketplace_one.get_address()
const marketplace_two_address = marketplace_two.get_address()
const marketplace_three_address = marketplace_three.get_address()
const minter_one_address = minter_one.get_address()
const minter_two_address = minter_two.get_address()
const minter_three_address = minter_three.get_address()

/* Verbose mode ------------------------------------------------------------ */

set_quiet(true);

/* Endpoint ---------------------------------------------------------------- */

set_mockup()
//TODO create init_mockup function for ts-types library

/* Tez Date Utils ---------------------------------------------------------- */

export class TezDate implements ArchetypeType {
  private _content: Date
  constructor(v: Date = new Date()) {
    this._content = new Date(v.getTime() - v.getMilliseconds())
  }
  equals(x: TezDate): boolean {
    return this.toSecond() === x.toSecond()
  }
  toSecond(): number {
    return this._content.getTime() / 1000
  }
  addDuration(dur: Duration): TezDate {
    return new TezDate(
      new Date(this.toSecond()*1000 + dur.toSecond()*1000) 
  )}
  addDurationLiteral(x : string) : TezDate {
    return this.addDuration(new Duration(x))
  }
  toDate(): Date { 
    return new Date(this._content)
  }
}



/* Utils ------------------------------------------------------------------- */



  interface testParams {
    description: string,
    account : Account,
    amount : BigNumber,
    direction: "increase" | "decrease" | "unchanged",
    expected_change: BigNumber,
    caller: boolean,
    before: BigNumber,
    actual_after: BigNumber,
    expected_after: BigNumber,
    error_message: string
    info_message: string,
    cost: BigNumber

  }


function posify (num : BigNumber) : BigNumber {
  if (num.isNegative()) return num.negated()
  return num
}

function negify (num : BigNumber) : BigNumber {
  if (num.isPositive()) return num.negated()
  return num
}
// with_cost function provides the cost of a transaction
const with_cost = async (f : { () : Promise<any> }, caller : Account) : Promise<BigNumber> => {
  const balance_before = await caller.get_balance();
  const res = await f();
  const balance_after = await caller.get_balance();
  return balance_before.to_big_number().minus(balance_after.to_big_number());
}

 async function generate_test_params_array(
  description: string,
  tpArray: Array<testParams>, 
  caller: Account,
  entrypoint : () => Promise<CallResult>
  ) : Promise<testParams[]> {

  for (const testParams of tpArray) {
    
    if(testParams.amount) {
      if (
        (testParams.amount.isNegative() && testParams.direction === "increase")) {
          throw ("amount and direction are incompatible")
        }
        testParams.amount = posify(testParams.amount)
      }
    if (
       !testParams.amount || testParams.amount.isEqualTo(new BigNumber(0))) {
      if (testParams.direction === "increase" || testParams.direction === "decrease") {
        throw new Error("amount must be non-zero if direction is increase or decrease")
      } else {
      testParams.direction = "unchanged"}
      testParams.amount = new BigNumber(0)
    }


  switch (testParams.direction) {
    case "increase":
      testParams.expected_change = posify(testParams.amount)
      break;
    case "decrease":
      testParams.expected_change = negify(testParams.amount)
      break;
    case "unchanged":
      testParams.expected_change = new BigNumber(0)
      break;
    default:
      throw new Error("direction must be increase, decrease or unchanged")
  }
  testParams.before = (await testParams.account.get_balance()).to_big_number()
}
// const CR = await entrypoint()
let callerTotalSpent = await with_cost(entrypoint, caller)

for (const tp of tpArray) {
  
  const before = tp.before
  const actual_after = await (await tp.account.get_balance()).to_big_number()
  
  const expected_degree = new Tez(tp.amount, 'mutez').toString('tez')
  const expected_direction = tp.direction
  const expected_change = tp.expected_change
  tp.cost = tp.caller ? callerTotalSpent.plus(expected_change) : new BigNumber(0)
  const expected_after = before.plus(expected_change).minus(tp.cost)


  const actual_change = actual_after.minus(before)
  const actual_direction = actual_change.isZero() ? "unchanged" : 
        actual_change.isPositive() ? "increase" : "decrease"
  const actual_amount = new Tez(posify(actual_change), 'mutez').toString('tez')

  const testError : string = 
  `ERROR: ${tp.account.get_name()} :\n expected: ${expected_direction} of: ${expected_degree}}\n
    actual: ${actual_direction} of: ${actual_amount}\n `
  tp.error_message = testError

  // if (!tp.caller) { 
    tp.actual_after = actual_after
    tp.expected_after = expected_after


    // assert(actual_after.isEqualTo(expected_after), testError) 
  // } else {
  //   assert(actual_after.isLessThan(expected_after), testError)
  //   const apparent_gas_cost = expected_after.minus(actual_after)
  //   assert(apparent_gas_cost.isLessThan(new BigNumber(0.0000005)),
  //  `apparent gas cost is suspiciously high: " + ${tezBigNumberToString(apparent_gas_cost)}\n
  //  entrypoint: ${entrypoint}\n
  //  caller: ${tp.account.get_name()}\n`)
  //   }

    const successMessage = `${tp.account.get_name()} : ${actual_direction} : ${actual_amount}`
    tp.info_message = successMessage
  }
  return tpArray
  }


/* Now --------------------------------------------------------------------- */

// const nativeDateNow = new Date()
// const tezDateNow = new TezDate(nativeDateNow)
// const tezDate5 = tezDateNow.addDurationLiteral('5m')
// const tezDate10 = tezDateNow.addDurationLiteral('10m')

// /* Scenario ---------------------------------------------------------------- */


const creatorRate = new Rational(1/10)
const minterRate = new Rational(1/100)
const marketplaceRate = new Rational(1/100)

const creatorRateBN = new Rational(1/10).to_big_number()
const minterRateBN = new Rational(1/100).to_big_number()
const marketplaceRateBN = new Rational(1/100).to_big_number()

describe('[Tidemark_fa2] contract', async () => {
  it('Deploys successfully', async () => {

    await tidemark_fa2.deploy(
      creator_one_address,
      creator_one_address,
      minter_one_address,
      {}) // params
  });

})

const tmdBytes = Bytes.hex_encode("ipfs://bafybeigzpfsrvvb3ifrfe4tmahmenuf3flbyhi5y4v6g4fn6pqpiqd4wwy")
let tmdMap : Array<[string, Bytes]> = [[" ", tmdBytes]]

describe('[Mint] entrypoint', async () => {
  it('Does not fail with correct inputs', async () => {

    await tidemark_fa2.mint(
      tmdMap,
      creatorRate,
      minterRate,
      marketplaceRate,
      {as: creator_one}) // params

    }); 

  // it('Second nft mints succesfully', async () => {

  //   await tidemark_fa2.mint(
  //     tmdMap,
  //     creatorRate,
  //     minterRate,
  //     marketplaceRate,

  //     {as: creator_one}) // params
    
  //     const ledger_value_two = await tidemark_fa2.get_ledger_value(new Nat(2))
  //     logContainer("ledger_value_two", ledger_value_two)
      
  //     const metadata_value_two = await tidemark_fa2.get_token_metadata_value(new Nat(2))
  //     logContainer("token_info_2", metadata_value_two?.token_info)

  // });

})
 
//CONSTANTS



describe('[Make Offer] 1', async () => {

  let description : string = "workds"
  const entrypoint = () => tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, MO1_BID, {as: collector_one, amount: MO1_BID})
  let MO1_BID : Tez = new Tez(10)
  let tpListOne : Array<testParams> = [{
    description: "creator_one recieves 1/10 of bid as creator_fee",
    account: creator_one,
    amount: MO1_BID.to_big_number().times(creatorRateBN),
    direction: "increase",
  } as testParams,
  {
    description: "minter_one recieves 1/100 of bid as minter_fee",
    account: minter_one,
    amount: MO1_BID.to_big_number().times(minterRateBN),
    direction: "increase",
  } as testParams,
  {
    description: "marketplace_one recieves no fee",
    account: marketplace_one,
    direction: "unchanged"
  } as testParams,
  {
    description: "collector_one pays bid",
    account: collector_one,
    amount: MO1_BID.to_big_number(),
    direction: "decrease",
    caller: true
  } as testParams
  ]

before(async function() {
  //NOTE that this before block is actually being run AFTER tpList and then the it blocks are defined,
  //but BEFORE the actual content of the it blocks are run
tpListOne = await generate_test_params_array(
  description,
  tpListOne,
  collector_one, 
  entrypoint)
//   let MO1_BID : Tez
//   let MO1_CR : CallResult
//   MO1_BID = new Tez(11)
//   description = "works"
//    thingo = await magicFunc(entrypoint)  
//    thingoZero = {} as testObj

})


for (const tp of tpListOne) {
it(`${tp.description}`, async function() {
  this.tp = tp
  
         assert(tp.actual_after.isEqualTo(tp.expected_after), tp.error_message) 

    })

  }

afterEach(async function() {
  if (this.tp && this.tp.info_message) {
    console.log(this.tp.info_message)
  }

})

})
// describe('[make_offer] entrypoint', async () => {

// let MO1_BID : Tez
// let MO1_CR : CallResult

// // const MO1_Description = "Collector 1 makes an offer of 10 tez on token 1, via marketplace 1"
// // MO1_BID = new Tez(10)
// // const MO1_as = collector_one
// // const tpListOne : Array<testParams> = [{
// //   account: creator_one,
// //   amount: MO1_BID.to_big_number().times(creatorRateBN),
// //   direction: "increase",
// // } as testParams,
// // {
// //   account: minter_one,
// //   amount: MO1_BID.to_big_number().times(minterRateBN),
// //   direction: "increase",
// // } as testParams,
// // {
// //   account: marketplace_one,
// //   direction: "unchanged"
// // } as testParams,
// // {
// //   account: collector_one,
// //   amount: MO1_BID.to_big_number(),
// //   direction: "decrease",
// //   caller: true
// // } as testParams

// // ]


// // const entrypoint = () => tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, MO1_BID, {as: MO1_as, amount: MO1_BID})

// // await generate_test_params_array(
// //   "MO1",
// //   MO1_Description,
// //   tpListOne, 
// //   entrypoint
// //   )

// //   before(async () => {

  
// //   })

//   it('correctly updates balances', async () => {
//     const MO1_Description = "Collector 1 makes an offer of 10 tez on token 1, via marketplace 1"
//     MO1_BID = new Tez(10)
//     const MO1_as = collector_one
//     const entrypoint = () => tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, MO1_BID, {as: MO1_as, amount: MO1_BID})
    
//     const tpListOne : Array<testParams> = [{
//       account: creator_one,
//       amount: MO1_BID.to_big_number().times(creatorRateBN),
//       direction: "increase",
//     } as testParams,
//     {
//       account: minter_one,
//       amount: MO1_BID.to_big_number().times(minterRateBN),
//       direction: "increase",
//     } as testParams,
//     {
//       account: marketplace_one,
//       direction: "unchanged"
//     } as testParams,
//     {
//       account: collector_one,
//       amount: MO1_BID.to_big_number(),
//       direction: "decrease",
//       caller: true
//     } as testParams
//   ]



//     await generate_test_params_array(
//       "MO1",
//       MO1_Description,
//       tpListOne, 
//       entrypoint
//       )
//       it('doers another thing', async () => {
//         assert(true)
//       })
//   })

//   // it('MO1: ')

// //   it('Does not fail with correct inputs', async () => {
// //     await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(4), {as: collector_one, amount: new Tez(4)})
// //     delay_mockup_now_by_second(100)
// //   })

// // it('Second lower offer fails', async () => {
// //   expect_to_fail(async () => {
// //   await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(3), {as: collector_two, amount: new Tez(3)})
// //   }, att.string_to_mich("incoming bid must be greater than current bid"))
// //   delay_mockup_now_by_second(101)

// // })

// // it('Second higher offer succeeds', async () => {
// //   await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(10), {as: collector_one, amount: new Tez(10)})
// //   const ledger_value_one = await tidemark_fa2.get_ledger_value(new Nat(1))
// //   logContainer("ledger_value_one", ledger_value_one)
// //   const bid_history = await tidemark_fa2.get_bid_asset()
// //   logContainer("bid_history", bid_history)
// //   delay_mockup_now_by_minute(400)

// //   })

// //   it('Third higher offer succeeds', async () => {
// //     await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(16), {as: collector_one, amount: new Tez(16)})
// //     const ledger_value_one = await tidemark_fa2.get_ledger_value(new Nat(1))
// //     logContainer("ledger_value_one", ledger_value_one)
// //     const bid_history = await tidemark_fa2.get_bid_asset()
// //     delay_mockup_now_by_minute(800)

    
// //     })
// })

// describe('[sell] entrypoint', async () => {
//   it('Does not fail with correct inputs', async () => {

//     await tidemark_fa2.sell(new Nat(1), {as: creator_one})
//     const ledger_value_one = await tidemark_fa2.get_ledger_value(new Nat(1))
//     logContainer("ledger_value_one", ledger_value_one)
//     console.log(ledger_value_one?.l_bid_number.toString())
//   delay_mockup_now_by_minute(500)

//   })

// // OWNER IS NOW COLLECTOR_ONE
//   it('Can be bought and sold a few times without error', async () => {
//     console.log("before bid of 5")
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(5), {as: collector_three, amount: new Tez(5)})
//     console.log("before bid of 30")
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(30), {as: collector_two, amount: new Tez(30)})
//     console.log("before sale at 30")
//     await tidemark_fa2.sell(new Nat(1), {as: collector_one})
//   delay_mockup_now_by_minute(200)
//     console.log("owner is now collector_one")

// //OWNER IS NOW COLLECTOR_TWO
//     console.log("before bid of 80")
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_three_address, new Tez(80), {as: collector_one, amount: new Tez(80)})
//     console.log("before bid of 120")
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(120), {as: collector_three, amount: new Tez(120)})
//     console.log("before sale at 120")
//     await tidemark_fa2.sell(new Nat(1), {as: collector_two})
//   delay_mockup_now_by_minute(5000)
//     console.log("owner is now collector_two")

// // NOTE TO SELF - for some reason  correctly changeing the creator fee so it tracks the amount above the
// // tidemark is causing the sale to fail at this point. Perhaps something is wrong with how 
// // things are being added and tracked - maybe the token balance tracker is going below zero or soemthing?
// //But it has to be a problem that is triggered in the sale.... hmmm
// //Its to do with changing last_bid for tidemark


// //OWNER IS NOW COLLECTOR_THREE
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(180), {as: collector_one, amount: new Tez(180)})
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(230), {as: owner_one, amount: new Tez(230)})
//     await tidemark_fa2.sell(new Nat(1), {as: collector_three})
// delay_mockup_now_by_minute(50)
//     console.log("owner is now collector_three")


// //OWNER IS NOW OWNER_ONE
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(40), {as: collector_one, amount: new Tez(40)})
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(500), {as: owner_two, amount: new Tez(500)})
//     await tidemark_fa2.sell(new Nat(1), {as: owner_one})
// delay_mockup_now_by_minute(50)
//     console.log("owner is now owner_one")
// //OWNER IS NOW OWNER_TWO

//     const sp_band_asset = await tidemark_fa2.get_sp_band_asset()
//     console.log("sp_band_asset")
//     console.dir(sp_band_asset, {depth: null})

//     const sp_ownership_asset = await tidemark_fa2.get_sp_ownership_asset()
//     console.log("sp_ownership_asset")
//     console.dir(sp_ownership_asset, {depth: null})

//     const ownership_asset = await tidemark_fa2.get_ownership_asset()
//     console.log("ownership_asset")
//     console.dir(ownership_asset, {depth: null})

// })
// })

function tezMinus(bigSum : Tez, smallSum : Tez) {
  const output = bigSum.to_big_number().minus(smallSum.to_big_number())
  if (output.isNegative()) throw Error (`tezMinus output of ${output} is invalid.`)

  return new Tez(output)
}

function tezAsNumber (input : Tez) {
  return input.to_big_number().dividedBy(1000000).toNumber()
}

function tezAsString ( input : Tez) {
  return `${tezAsNumber(input)} tez`
}

function tezBigNumberToString (input : BigNumber) {
  if (input === new BigNumber(0)) return `0 tez`
  if (input < new BigNumber(0) || !input) throw Error (`tezBigNumberToString input of ${input} is invalid.`)
  return `${input.dividedBy(1000000).toNumber()} tez`
}

// function logTezChange (contractName: string, before: Tez, after: Tez) {
//   let tezChange = tezAsNumber(after) - tezAsNumber(before)
//   let sign = ``
//   let stringColour
//   switch (true) {
//     case (tezChange > 0):
//       stringColour = `\x1b[32m`;
//       sign = `+`
//       break
//     case (tezChange < 0):
//       stringColour = `\x1b[31m`
//       break
//     default:
//       stringColour = ``
//       break
//   }
//   console.log(`Change in ${contractName}:`, stringColour, `${sign} ${tezAsNumber(after) - tezAsNumber(before)}`, `\x1b[0m`, `tez`)
// }



//TEMPLATE

// describe('[ENTRYPOINT_NAME] entrypoint', async () => {


//   it('Fails something or does something', async () => {

//   })
// })




//completium-cli set binary path archetype
