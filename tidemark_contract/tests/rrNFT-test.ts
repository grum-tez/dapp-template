// import * as att from "@completium/archetype-ts-types";
// import { ArchetypeType, Rational, Duration, date_cmp, Tez } from '@completium/archetype-ts-types';
// import { rrNFT } from './binding/rrNFT'
// import {get_account, set_mockup, set_mockup_now, set_quiet, delay_mockup_now_by_minute, delay_mockup_now_by_week} from "@completium/experiment-ts";
// import { expect_to_fail } from '@completium/experiment-ts';
// const assert = require('assert')

// /* Accounts ---------------------------------------------------------------- */

// const owner_one = get_account('owner_one')
// const owner_two = get_account('owner_two')
// const owner_three = get_account('owner_three')
// const owner_four = get_account('owner_four')
// const owner_five = get_account('owner_five')
// const owner_six = get_account('owner_six')
// const creator_one = get_account('creator_one')
// const collector_one = get_account('collector_one')
// const collector_two = get_account('collector_two')
// const collector_three = get_account('collector_three')
// const marketplace_one = get_account('marketplace_one')
// const marketplace_two = get_account('marketplace_two')
// const marketplace_three = get_account('marketplace_three')
// const minter_one = get_account('minter_one')
// const minter_two = get_account('minter_two')
// const minter_three = get_account('minter_three')


// /* Verbose mode ------------------------------------------------------------ */

// set_quiet(true);

// /* Endpoint ---------------------------------------------------------------- */

// set_mockup()
// //TODO create init_mockup function for ts-types library

// /* Tez Date Utils ---------------------------------------------------------- */

// export class TezDate implements ArchetypeType {
//   private _content: Date
//   constructor(v: Date = new Date()) {
//     this._content = new Date(v.getTime() - v.getMilliseconds())
//   }
//   equals(x: TezDate): boolean {
//     return this.toSecond() === x.toSecond()
//   }
//   toSecond(): number {
//     return this._content.getTime() / 1000
//   }
//   addDuration(dur: Duration): TezDate {
//     return new TezDate(
//       new Date(this.toSecond()*1000 + dur.toSecond()*1000) 
//   )}
//   addDurationLiteral(x : string) : TezDate {
//     return this.addDuration(new Duration(x))
//   }
//   toDate(): Date { 
//     return new Date(this._content)
//   }
// }

// /* Utils ------------------------------------------------------------------- */

// //integral function:
// function integral(x : number, y : number, f : (x : number) => number) : number {
//   let sum = 0
//   for (let i = x; i < y; i++) {
//     sum += f(i)
//   }
//   return sum
// }
// /* Now --------------------------------------------------------------------- */

// const nativeDateNow = new Date()
// const tezDateNow = new TezDate(nativeDateNow)
// const tezDate5 = tezDateNow.addDurationLiteral('5m')
// const tezDate10 = tezDateNow.addDurationLiteral('10m')

// /* Scenario ---------------------------------------------------------------- */

// const creatorAddress = creator_one.get_address()
// const minterAddress = minter_one.get_address()
// const royaltyRateRational = new Rational(1/10)
// const minterRateRational = new Rational(1/100)
// const marketRateRational = new Rational(1/100)
// const auctionDuration = new Duration('156w')
// const gracePeriod = new Duration('1w')

// describe('[RRNFT] contract', async () => {
//   it('Deploys successfully', async () => {

//     await rrNFT.deploy(
//       creatorAddress,
//       minterAddress,
//       royaltyRateRational,  // royaltyRate
//       minterRateRational, // minterRate
//       marketRateRational, // marketRate
//       auctionDuration, // auctionDuration
//       gracePeriod, // gracePeriod
//       {}) // params
    
//   });

//   it('Creator address input matches creator address output', async () => {
//     console.log('creator Address as mich: ', creatorAddress.to_mich())
//     const gotCreator = await rrNFT.get_creator()
//     assert(creatorAddress.equals(gotCreator))
//     })
//     it('RoyaltyRate input matches royalty rate output', async() => {
//     const gotRoyaltyRate = await rrNFT.get_royaltyRate()
//     assert(royaltyRateRational.equals(gotRoyaltyRate))
//     })
//     it('initial bidder value is none', async() => {
//     const bidder = await rrNFT.get_bidder()
//     assert(bidder.is_none())
//     })


// })


// describe('[INITIATE] entrypoint', async () => {

//   it('Fails if called by non-creator', async () => {
//     await set_mockup_now(nativeDateNow)
//     await expect_to_fail(async () => {
//       await rrNFT.initiate({as: owner_one})
//     }, att.string_to_mich("\"INVALID_CALLER\""))
//   })

//   it('Initiates without error', async () => {
//     await rrNFT.initiate({as: creator_one})
//   })
  
//   it('Fails if already initiated', async () => {
//     await expect_to_fail(async () => {
//       await rrNFT.initiate({as: creator_one})
//     }, att.string_to_mich("\"contract already initiated\""))
//   })


//   it('Initiate variable is updated to true', async () => {
//     const initiated  = await rrNFT.get_initiated()
//     assert(initiated)
//   })


// })

// function tezMinus(bigSum : Tez, smallSum : Tez) {
//   const output = bigSum.to_big_number().minus(smallSum.to_big_number())
//   if (output.isNegative()) throw Error (`tezMinus output of ${output} is invalid.`)

//   return new Tez(output)
// }

// function tezAsNumber (input : Tez) {
//   return input.to_big_number().dividedBy(1000000).toNumber()
// }

// function tezAsString ( input : Tez) {
//   return `${tezAsNumber(input)} tez`
// }

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

// //WORKING ON TEST HARNESS ::

//  //write some code that takes this input:


//     // const sampleInput3 = {
//     //   bidder: {
//     //     before: {
//     //     operation: "=",
//     //     value: owner_one    
//     //     },
//     //     after: {
//     //       operation: "!=",
//     //       value: "before"
//     //   }
//     // }

//     // interface testHarnessInput {
//     //   bidder : object
//     // }

// // END WORKING


// describe('[MAKE_OFFER] entrypoint', async () => {

// //FIRST SCENARIO:

// // 0. creator_one is current owner of the tidemark NFT. 
// // 1. collector_two bids 10tz (make_offer).
// // 2. collector_three bids 20tz (make_offer)
// // 3. owner_one bids 45tz (make_offer)
// // 4. creator_one accepts 45tz bid (sell)

//   it('Fails if bid is 0tz', async () => {
//     await expect_to_fail(async () => {
//       await rrNFT.makeOffer(marketplace_one.get_address(), {amount: new Tez(0), as: collector_two})
//     }, att.string_to_mich("\"Your bid must be greater than Zero\""))
//     delay_mockup_now_by_minute(1)
//   })

//   // it('Fails if ...', async () => {
//   //   await expect_to_fail(async () => {
//   //     await /* entrypoint call */)
//   //   }, /* micheline error message */)
//   // })

//   const bid_one_amount = new Tez(10)
//   const bid_two_amount = new Tez(20)
//   const bid_three_amount = new Tez(45)


//   it('Fails if bid is equal to current bid', async () => {
//     // 1. collector_two bids 10tz (make_offer).
//     await rrNFT.makeOffer(marketplace_one.get_address(), {amount: bid_one_amount, as: collector_two})

//     await expect_to_fail(async () => {
//     await rrNFT.makeOffer(marketplace_one.get_address(), {amount: bid_one_amount, as: collector_three})
//     }, att.string_to_mich("\"your Bid must be higher than current bid\""))
//   })

//   it('Fails if bid is lower than current bid', async () => {
//     await expect_to_fail(async () => {
//     await rrNFT.makeOffer(marketplace_one.get_address(), {amount: new Tez(1), as: collector_three})
//     }, att.string_to_mich("\"your Bid must be higher than current bid\""))
//   })

//   it('Fails if owner attempts to bid', async () => {
//     await expect_to_fail(async () => {
//     await rrNFT.makeOffer(marketplace_one.get_address(), {amount: bid_two_amount, as: creator_one})
//     }, att.string_to_mich("\"The owner's address may not bid\""))
//   })


// it('Contract balance correctly updated by a bid', async () => {

//     const contract_balance_before = await rrNFT.get_balance()

//     // Balance before is the first bid of 10tz less 10% creator royalty
//     assert(contract_balance_before.equals(new Tez(9)))
    
//     // 2. collector_three bids 20tz (make_offer)
//     await rrNFT.makeOffer(marketplace_two.get_address(), {amount: bid_two_amount, as: collector_two})
    
//     delay_mockup_now_by_minute(10)

//     const contract_balance_after = await rrNFT.get_balance()
//     // Balance after is the second bid of 20tz less 10% creator royalty
//     assert(contract_balance_after.equals(new Tez(18)))
  
//   })

// it('Tidemark variable correctly updated by a bid', async () => {

//     const tidemark_before = await rrNFT.get_tidemark()
//     assert(tidemark_before.equals(new Tez(20)))

//     // 3. owner_one bids 45tz (make_offer)
//     await rrNFT.makeOffer(marketplace_three.get_address(), {amount: bid_three_amount, as: owner_one})

//     delay_mockup_now_by_minute(1)
//     const tidemark_after  = await rrNFT.get_tidemark()
//     assert(tidemark_after.equals(new Tez(45)))
    
//   })
// })


// //   //A function to take an integral under a curve between 0 and 1:
// //   const integral = (f:any, a:any, b:any) => {
// //     const n = 1000000
// //     const h = (b - a) / n
// //     let sum = 0
// //     for (let i = 0; i < n; i++) {
// //       sum += f(a + i * h)
// //     }
// //     return sum * h
// //   }





// //   it('Fails if auction has expired', async () => {
// //     delay_mockup_now_by_week(156)
// //     await expect_to_fail(async () => {
// //       await rrNFT.makeOffer(marketplace_one.get_address(), {amount: new Tez(1000), as: collector_three})
// //     }, att.string_to_mich("\"The auction has already concluded\""))
// //   })
  
// // })
  
// // describe('[SELL] entrypoint', async () => {
  
// //   it('Fails if called by bidder', async () => {
// //     await expect_to_fail(async () => {
// //       await rrNFT.sell({as: owner_one})
// //     }, att.string_to_mich("\"Only the owner may sell the token\""))
// //     })

// //   it('Fails if called by non-owner', async () => {
// //     await expect_to_fail(async () => {
// //       await rrNFT.sell({as: collector_three})
// //     }, att.string_to_mich("\"Only the owner may sell the token\""))
// //     })
    
// //     it('Pays correct amounts out to marketplaces', async () => {
// //     await rrNFT.sell({as: creator_one})
// //     const marketplace_one_balance = await marketplace_one.get_balance()
// //     const marketplace_two_balance = await marketplace_two.get_balance()
// //     const marketplace_three_balance = await marketplace_three.get_balance()
// //     console.log('marketplace_one_balance', marketplace_one_balance)
// //     console.log('marketplace_two_balance', marketplace_two_balance)
// //     console.log('marketplace_three_balance', marketplace_three_balance)


// //     })
    

//   //   it('integrate Test', async () => {
//   //     // await rrNFT.integrateExpCurveTest(new Rational(0), new Rational(0.9), {})
//   //     await rrNFT.integrateExpCurveTest(new Rational(0), new Rational(0.8), {})
//   //     const answer1 = await rrNFT.get_answer()
//   //     await rrNFT.integrateExpCurveTest(new Rational(0.8), new Rational(0.9), {})
//   //     const answer2 = await rrNFT.get_answer()
//   //     await rrNFT.integrateExpCurveTest(new Rational(0.9), new Rational(0.999999), {})
//   //     const answer3 = await rrNFT.get_answer()
//   //     console.log('combined', answer1.plus(answer2).plus(answer3).toString())
//   //     await rrNFT.integrateExpCurveTest(new Rational(0), new Rational(0.999999), {})
//   //     const answer4 = await rrNFT.get_answer()
//   //     console.log('single', answer4.toString())
//   //   })

//   // })

  


// //   // TESTS FOR SQUARE ROOT FUNCTION:
// //   describe('SquareRoot function test', async () => {
  
// //     it('Returns a square root correctly', async () => {
// //       await rrNFT.squareRoot(new Rational(0.3), new Rational(0), new Rational(1), {});
// //       const answer = await rrNFT.get_answer();
// //       assert(answer.equals(new Rational(0.54736328125)))
// //     })
// // // TODO TEST: fails gracefully when given invalid inputs (eg negative or infinite input)

  
// //   }) 


           