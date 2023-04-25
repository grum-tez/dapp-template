/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as att from '@completium/archetype-ts-types'
import { greetName } from 'numinousk'
import {
  ArchetypeType,
  Rational,
  Duration,
  Tez,
  Bytes,
  Nat,
  CallResult,
} from '@completium/archetype-ts-types'
import { tidemark_fa2 } from './binding/tidemark_fa2'
import {
  get_account,
  set_mockup,
  set_mockup_now,
  set_quiet,
  Account,
  Parameters,
  delay_mockup_now_by_second,
} from '@completium/experiment-ts'
import { BigNumber } from 'bignumber.js'
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_UP })
import assert from 'assert'

/* Accounts ---------------------------------------------------------------- */
greetName('frank')
const creator_one = get_account('creator_one')
// const owner_one = get_account('owner_one')
// const owner_two = get_account('owner_two')
// const owner_three = get_account('owner_three')
// const owner_four = get_account('owner_four')
// const owner_five = get_account('owner_five')
// const owner_six = get_account('owner_six')
const collector_one = get_account('collector_one')
const collector_two = get_account('collector_two')
const collector_three = get_account('collector_three')
const marketplace_one = get_account('marketplace_one')
const marketplace_two = get_account('marketplace_two')
// const marketplace_three = get_account('marketplace_three')
const minter_one = get_account('minter_one')
// const minter_two = get_account('minter_two')
// const minter_three = get_account('minter_three')

const creator_one_address = creator_one.get_address()
// const owner_one_address = owner_one.get_address()
// const owner_two_address = owner_two.get_address()
// const owner_three_address = owner_three.get_address()
// const owner_four_address = owner_four.get_address()
// const owner_five_address = owner_five.get_address()
// const owner_six_address = owner_six.get_address()
// const collector_one_address = collector_one.get_address()
// const collector_two_address = collector_two.get_address()
// const collector_three_address = collector_three.get_address()
const marketplace_one_address = marketplace_one.get_address()
// const marketplace_two_address = marketplace_two.get_address()
// const marketplace_three_address = marketplace_three.get_address()
const minter_one_address = minter_one.get_address()
// const minter_two_address = minter_two.get_address()
// const minter_three_address = minter_three.get_address()

/* Verbose mode ------------------------------------------------------------ */

set_quiet(true)

/* Endpoint ---------------------------------------------------------------- */

set_mockup()
set_mockup_now(new Date())
//TODO create init_mockup function for ts-types library

/* Logging utils ------------------------------------------------------------- */

// const objectMap = (obj: any, fn: any) =>
//   Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]))

// const make_readable = (x: any): string => {
//   if (typeof x == 'string') return x
//   if (typeof x == 'number') return x.toString()
//   if (typeof x == 'boolean') return x.toString()
//   if (x instanceof BigNumber) return x.toString()
//   if (x instanceof Date) return x.toString()
//   if (x instanceof Address) return x.toString()
//   if (x instanceof Bytes) return x.toString()
//   if (x instanceof Enum) return x.toString()
//   if (x instanceof Nat) return x.toString()
//   if (x instanceof Rational) return x.toString()
//   if (x instanceof Duration) return x.toString() + 'seconds'
//   if (x instanceof Tez) return x.toString('tez') + ' tez'
//   return x
// }

// const make_object_readable = (x: any): any => {
//   const readable_object = objectMap(x, make_readable)
//   return readable_object
// }
// const make_asset_readable = (x : any) : string => {
// }

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
    return new TezDate(new Date(this.toSecond() * 1000 + dur.toSecond() * 1000))
  }
  addDurationLiteral(x: string): TezDate {
    return this.addDuration(new Duration(x))
  }
  toDate(): Date {
    return new Date(this._content)
  }
}

/* Utils ------------------------------------------------------------------- */

interface costObject {
  call_name: string
  approximate_cost: BigNumber
}

interface testParams {
  name: string
  description: string
  account: Account
  expected_change: number
  ec_BN: BigNumber // expected_change as BigNumber
  expected_direction: 'increase' | 'decrease' | 'unchanged'
  expected_amount: string
  actual_before: BigNumber
  info_message: string
  error_message: string
  accumulated_approx_cost: BigNumber
  cost_array: costObject[]
  actual_after: BigNumber
  expected_after: BigNumber
  expected_after_approx_costs: BigNumber
  difference: BigNumber
  tolerance: BigNumber

  // variable_function:
  // variable_before: any,
  // variable_after: any,
}

interface CallMaker {
  name: string
  description: string
  as: Account
  amount: Tez
  call: (call_params: Parameters) => Promise<att.CallResult>
  delay_after: number | Duration | string
  delay_seconds: number
}

function posify(num: BigNumber): BigNumber {
  if (num.isNegative()) return num.negated()
  return num
}

// function negify(num: BigNumber): BigNumber {
//   if (num.isPositive()) return num.negated()
//   return num
// }

function get_cost(
  storage_difference: number,
  gas_used: number,
  bytes_size: number
): BigNumber {
  const fees = 100 + bytes_size + gas_used * 0.1
  const burn = storage_difference * 250
  return new BigNumber(fees + burn).integerValue(BigNumber.ROUND_UP)
}

const handleDelayInput = (delay: number | Duration | string): number => {
  let output = 0
  if (typeof delay == 'number') output = delay
  if (typeof delay == 'string') output = new Duration(delay).toSecond()
  if (delay instanceof Duration) output = delay.toSecond()
  return output
}

// interface testState = {'failed' | 'passed' | 'pending' | undefined;}

const log_messages = (
  tp: testParams,
  testState: 'failed' | 'passed' | 'pending' | undefined
) => {
  if (testState === 'failed') {
    console.log(tp.error_message)
  } else {
    console.log(tp.info_message)
  }
}
interface MCGTout {
  delta: BigNumber
  call_result: CallResult
}

// with_cost function provides the cost of a transaction
const make_call_get_delta = async (
  f: { (call_params: Parameters): Promise<att.CallResult> },
  call_params: Parameters
): Promise<MCGTout> => {
  const balance_before = await call_params.as.get_balance()
  const res = await f(call_params)
  // const cost = get_cost(
  //   res.paid_storage_size_diff,
  //   res.consumed_gas,
  //   res.storage_size
  // )
  const balance_after = await call_params.as.get_balance()
  return {
    delta: balance_before.to_big_number().minus(balance_after.to_big_number()),
    call_result: res,
  }
}
async function run_scenario_test(
  scenario_description: string,
  call_makers: CallMaker[],
  tpArray: Array<testParams>,
  mode: 'verbose' | 'quiet' = 'verbose'
): Promise<testParams[]> {
  for (const tp of tpArray) {
    tp.ec_BN = new BigNumber(tp.expected_change).times(1000000)
    tp.actual_before = (await tp.account.get_balance()).to_big_number()
    tp.expected_direction = tp.ec_BN.isZero()
      ? 'unchanged'
      : tp.ec_BN.isPositive()
      ? 'increase'
      : 'decrease'
    tp.expected_amount = new Tez(posify(tp.ec_BN), 'mutez').toString('tez')
    tp.accumulated_approx_cost = new BigNumber(0)
    tp.cost_array = []
  }

  for (const cm of call_makers) {
    if (!cm.amount)
      throw (
        'amount must be explicitly specified for account: ' + cm.as.get_name()
      )
    if (!cm.as) throw 'account must be explicitly specified for m cms'
    const target_tp_index = tpArray.findIndex((tp) => tp.account === cm.as)
    if (target_tp_index !== -1) {
      // const ec_BN = tpArray[target_tp_index].ec_BN
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { delta, call_result } = await make_call_get_delta(cm.call, {
        as: cm.as,
        amount: cm.amount,
      })
      const approximate_cost = get_cost(
        call_result.paid_storage_size_diff,
        call_result.consumed_gas,
        call_result.storage_size
      ).dividedBy(2)
      const cost_accumulator =
        tpArray[target_tp_index].accumulated_approx_cost.plus(approximate_cost)
      tpArray[target_tp_index].accumulated_approx_cost = cost_accumulator
      tpArray[target_tp_index].cost_array.push({
        call_name: cm.name,
        approximate_cost: approximate_cost,
      })
    }
    cm.delay_seconds = handleDelayInput(cm.delay_after)
    delay_mockup_now_by_second(cm.delay_seconds)
  }
  for (const tp of tpArray) {
    const actual_before = tp.actual_before
    const actual_after = (await tp.account.get_balance()).to_big_number()
    tp.expected_after = actual_before.plus(tp.ec_BN)
    tp.expected_after_approx_costs = tp.expected_after.minus(
      tp.accumulated_approx_cost
    )
    const actual_change = actual_after.minus(actual_before)
    const actual_direction = actual_change.isZero()
      ? 'unchanged'
      : actual_change.isPositive()
      ? 'increase'
      : 'decrease'
    const actual_amount = tezBNtoString(posify(actual_change))

    const num_calls_this_account = tp.cost_array.length

    const tolerance = new BigNumber(num_calls_this_account).times(150000)
    tp.tolerance = tolerance
    tp.actual_after = actual_after
    tp.difference = actual_after.minus(tp.expected_after).abs()

    const actual_string = `\n\tactual: ${actual_direction} by ${actual_amount}`
    const expected_string = `\n\texpected: ${tp.expected_direction} by ${tp.expected_amount}`
    const end_string = `\n\t-----\n`

    const apparent_costs_string =
      tp.cost_array.length > 0
        ? `\n\tapparent real total costs: ${tp.difference.toString()} mutez`
        : ''

    if (mode == 'verbose') {
      tp.info_message =
        `\n\tSUCCESS: ${tp.account.get_name()}\n\t` +
        actual_string +
        apparent_costs_string +
        end_string

      tp.error_message =
        `\n\tERROR: ${tp.account.get_name()}\n\t ` +
        expected_string +
        actual_string +
        apparent_costs_string +
        end_string
    }
  }
  return tpArray
}

/* Now --------------------------------------------------------------------- */

// const nativeDateNow = new Date()
// const tezDateNow = new TezDate(nativeDateNow)
// const tezDate5 = tezDateNow.addDurationLiteral('5m')
// const tezDate10 = tezDateNow.addDurationLiteral('10m')

// /* Scenario ---------------------------------------------------------------- */

const creatorRate = new Rational(1 / 10)
const minterRate = new Rational(1 / 100)
const marketplaceRate = new Rational(1 / 100)

// const creatorRateBN = new Rational(1/10).to_big_number()
// const minterRateBN = new Rational(1/100).to_big_number()
// const marketplaceRateBN = new Rational(1/100).to_big_number()

describe('[Tidemark_fa2] contract', function () {
  it('Deploys successfully', async () => {
    await tidemark_fa2.deploy(
      creator_one_address,
      creator_one_address,
      minter_one_address,
      {}
    ) // params
  })
})

const tmdBytes = Bytes.hex_encode(
  'ipfs://bafybeigzpfsrvvb3ifrfe4tmahmenuf3flbyhi5y4v6g4fn6pqpiqd4wwy'
)
const tmdMap: Array<[string, Bytes]> = [[' ', tmdBytes]]

describe('[Mint] entrypoint', function () {
  it('Does not fail with correct inputs', async () => {
    await tidemark_fa2.mint(tmdMap, creatorRate, minterRate, marketplaceRate, {
      as: creator_one,
    }) // params
  })

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

describe('[Make Offer] 2 successful calls', function () {
  before(async function () {
    //ENTRYPOINT CALLS AND THEIR CALL PARAMETERS

    testDataArray = await run_scenario_test(
      //Scenario Description:
      'Collector one makes an offer for token 1 for 10 tez via marketplace_one',
      //Array of calls to make:
      [
        {
          name: 'C2 bid 5',
          // description: "Collector two makes an offer for 5 tez on token one via marketplace_one",
          as: collector_two,
          amount: new Tez(5),
          call: (cp) =>
            tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, cp),
          delay_seconds: 100,
        } as CallMaker,
        {
          name: 'C1 bid 10',
          // description: "Collector one makes an offer for 10 tez on token one via marketplace_one",
          as: collector_one,
          amount: new Tez(10),
          call: (cp) =>
            tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, cp),
          delay_seconds: 150,
        } as CallMaker,
      ],
      testDataArray
    )
  })

  //LIST OF ACCOUNTS TO TEST AND EXPECTED CHANGES

  let testDataArray: Array<testParams> = [
    {
      description: 'creator_one recieves 1/10 of bid as creator_fee',
      account: creator_one,
      expected_change: 1,
    } as testParams,
    {
      description: 'minter_one recieves 1/100 of bid as minter_fee',
      account: minter_one,
      expected_change: 0.1,
    } as testParams,
    {
      description: 'marketplace_one recieves no fee',
      account: marketplace_one,
      expected_change: 0,
    } as testParams,
    {
      description: 'collector_one pays bid',
      account: collector_one,
      expected_change: -10,
    } as testParams,
    {
      description: 'collector_two bids unsuccessfully',
      account: collector_two,
      expected_change: 0,
    } as testParams,
  ]

  //EXECUTE TESTS FROM ARRAY.
  for (const tp of testDataArray) {
    it(`${tp.description}`, function () {
      this.tp = tp
      assert(tp.difference.isLessThanOrEqualTo(tp.tolerance), tp.error_message)
    })
  }

  afterEach(function () {
    if (this.tp && this.tp.info_message) {
      if (this.currentTest?.state === 'failed') {
        console.log(this.tp.error_message)
      } else {
        console.log(this.tp.info_message)
      }
    }
  })
})

describe('[Sell] 1 call', function () {
  before(async function () {
    //ENTRYPOINT CALLS AND THEIR CALL PARAMETERS

    testDataArray = await run_scenario_test(
      //Scenario Description:
      'Creator one sells token 1 for 10 tez to collector one via marketplace_one',
      //Array of calls to make:
      [
        {
          name: 'C1 sale',
          as: creator_one,
          amount: new Tez(0),
          call: (cp) => tidemark_fa2.sell(new Nat(1), cp),
          delay_after: 100,
        } as CallMaker,
      ],
      testDataArray
    )
  })

  //LIST OF ACCOUNTS TO TEST AND EXPECTED CHANGES

  let testDataArray: Array<testParams> = [
    {
      description: 'creator_one recieves balance of contract',
      account: creator_one,
      expected_change: 8.8,
    } as testParams,
  ]

  //EXECUTE TESTS FROM ARRAY.
  for (const tp of testDataArray) {
    it(`${tp.description}`, function () {
      this.tp = tp
      assert(tp.difference.isLessThanOrEqualTo(tp.tolerance), tp.error_message)
    })
  }

  afterEach(function () {
    if (this.tp && this.tp.info_message) {
      if (this.currentTest?.state === 'failed') {
        console.log(this.tp.error_message)
      } else {
        console.log(this.tp.info_message)
      }
    }
  })
})

describe('[sell series] three offers and a sale', () => {
  before(async function () {
    //ENTRYPOINT CALLS AND THEIR CALL PARAMETERS

    testDataArray = await run_scenario_test(
      //Parameter one - Scenario Description String:
      'Three offers are made on token one and then a sale. Collector One then sells the token to collector two',
      //Parameter two Array of calls to make, using CallMaker interface:
      [
        {
          name: 'C2 first offer',
          description: 'collector two makes an offer of 20 tez',
          as: collector_two,
          amount: new Tez(20),
          call: (cp) =>
            tidemark_fa2.make_offer(
              new Nat(1),
              marketplace_two.get_address(),
              cp
            ),
          delay_after: 100, //delay in seconds you want to have after the call is made
        } as CallMaker,
        {
          name: 'C3 first offer',
          // description: "optional string"
          as: collector_three,
          amount: new Tez(30),
          call: (cp) =>
            tidemark_fa2.make_offer(
              new Nat(1),
              marketplace_two.get_address(),
              cp
            ),
          delay_after: 150,
        } as CallMaker,
        {
          name: 'C2 second offer',
          as: collector_two,
          amount: new Tez(50),
          call: (cp) =>
            tidemark_fa2.make_offer(
              new Nat(1),
              marketplace_two.get_address(),
              cp
            ),
          delay_after: 150,
        } as CallMaker,
        {
          name: 'C1 sale',
          as: collector_one,
          amount: new Tez(0),
          call: (cp) => tidemark_fa2.sell(new Nat(1), cp),
          delay_after: 150,
        } as CallMaker,
      ],
      testDataArray
    )
  })

  //   //LIST OF ACCOUNTS TO TEST AND EXPECTED CHANGES

  let testDataArray: Array<testParams> = [
    {
      description: 'collector_two spends 50 tez on the offer',
      account: collector_two,
      expected_change: -50,
    } as testParams,
    {
      description: 'collector_three is outbid, and so spends only gas',
      account: collector_three,
      expected_change: 0,
    } as testParams,
    {
      description: 'creator_one recieves royalties',
      account: creator_one,
      expected_change: 4,
    } as testParams,
    {
      description: 'collector_one recieves balance of contract after fees',
      account: collector_one,
      expected_change: 45.2,
    } as testParams,
  ]

  //   //EXECUTE TESTS FROM ARRAY.
  for (const tp of testDataArray) {
    it(`${tp.description}`, function () {
      this.tp = tp
      assert(tp.difference.isLessThanOrEqualTo(tp.tolerance), tp.error_message)
    })
  }

  afterEach(function () {
    if (this.currentTest) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      log_messages(this.tp, this.currentTest.state)
    }
  })
})

// describe('[sell] entrypoint', async () => {
//   it('Does not fail with correct inputs', async () => {

//     await tidemark_fa2.sell(new Nat(1), {as: creator_one})
//     const ledger_value_one = await tidemark_fa2.get_ledger_value(new Nat(1))
//    delay_mockup_now_by_minute(500)

//   })

// // OWNER IS NOW COLLECTOR_ONE
//   it('Can be bought and sold a few times without error', async () => {
//     console.log("before bid of 5")
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(5), {as: collector_three, amount: new Tez(5)})
//     console.log("before bid of 30")
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(30), {as: collector_two, amount: new Tez(30)})
//     console.log("before sale at 30")
//     await tidemark_fa2.sell(new Nat(1), {as: collector_one})
//     delay_mockup_now_by_minute(200)
//     console.log("owner is now collector_one")

// //OWNER IS NOW COLLECTOR_TWO
//     console.log("before bid of 80")
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_three_address, new Tez(80), {as: collector_one, amount: new Tez(80)})
//     console.log("before bid of 120")
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(120), {as: collector_three, amount: new Tez(120)})
//     console.log("before sale at 120")
//     await tidemark_fa2.sell(new Nat(1), {as: collector_two})
//     delay_mockup_now_by_minute(5000)
//     console.log("owner is now collector_two")

// //OWNER IS NOW COLLECTOR_THREE
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(180), {as: collector_one, amount: new Tez(180)})
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(230), {as: owner_one, amount: new Tez(230)})
//     await tidemark_fa2.sell(new Nat(1), {as: collector_three})
//     delay_mockup_now_by_minute(50)
//     console.log("owner is now collector_three")

// //OWNER IS NOW OWNER_ONE
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(40), {as: collector_one, amount: new Tez(40)})
//     await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(500), {as: owner_two, amount: new Tez(500)})
//     await tidemark_fa2.sell(new Nat(1), {as: owner_one})
//     delay_mockup_now_by_minute(50)
//     console.log("owner is now owner_one")
// //OWNER IS NOW OWNER_TWO

// })
// })

// function tezMinus(bigSum: Tez, smallSum: Tez) {
//   const output = bigSum.to_big_number().minus(smallSum.to_big_number())
//   if (output.isNegative())
//     throw Error(`tezMinus output of ${output.toString()} is invalid.`)

//   return new Tez(output)
// }

// function tezAsNumber(input: Tez) {
//   return input.to_big_number().dividedBy(1000000).toNumber()
// }

// function tezAsString(input: Tez) {
//   return `${tezAsNumber(input)} tez`
// }

function tezBNtoString(input: BigNumber) {
  if (input === new BigNumber(0)) return `0 tez`
  if (!input) throw Error(`tezBigNumberToString input is invalid.`)
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

//completium-cli set binary path archetype

// Argument of type '[{ cp: Parameters; fn: (call_params: Parameters) => Promise<CallResult>; }, { cp: Parameters; fn: (call_params: Parameters) => Promise<...>; }]'
//  is not assignable to parameter of type
//  '[{ cp: Parameters; fn: (call_params: Parameters) => Promise<CallResult>; }]'.
// Source has 2 element(s) but target allows only 1.

// it('variable test - tidemark  ', async () => {

//   const ledger_1 = await tidemark_fa2.get_ledger_value(new Nat(1))
//   console.log(make_object_readable(ledger_1))
//   const tidemark_before = ledger_1?.l_tidemark
//   assert(tidemark_before?.equals(new Tez(10)), "tidemark should be 10 tez")
// })

// it('Second lower offer fails', async () => {
// expect_to_fail(async () => {
// await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(3), {as: collector_two, amount: new Tez(3)})
// }, att.string_to_mich("incoming bid must be greater than current bid"))

// })

// it('Second higher offer succeeds  ', async () => {

//   const ledger_1 = await tidemark_fa2.get_ledger_value(new Nat(1))
//   const tidemark_before = ledger_1?.l_tidemark
//   assert(tidemark_before?.equals(new Tez(10)), "tidemark should be 10 tez")
//   await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(20), {as: collector_one, amount: new Tez(20)}) // params

//   const ledger_1_after = await tidemark_fa2.get_ledger_value(new Nat(1))
//   const tidemark_after = ledger_1_after?.l_tidemark

//   assert(tidemark_after?.equals(new Tez(20)), "tidemark should be 20 tez")
//   delay_mockup_now_by_minute(400)

//   })

// describe('[TEMPLATE] template', async () => {

//   before(async function() {
//     //NOTE that this before block is actually being run AFTER tpDataArray and then the it blocks are defined,
//     //but BEFORE the actual content of the it blocks are run.

//     //ENTRYPOINT CALLS AND THEIR CALL PARAMETERS

//     testDataArray = await run_scenario_test(
//       //Parameter one - Scenario Description String:
//       "template template",
//       //Parameter two Array of calls to make, using CallMaker interface:
//       [{
//         name: "call_template_1",
//         // description: "optional string"
//         as: account_one,
//         amount: new Tez(5),
//         call: (cp) => bid_contract.entrypoint_name(manual_fill_first_parameter, manual_fill_second_parameter, cp) //cp is call parameters and are auto-filled - so just leave it   ),
//         delay_after: 100 //delay in seconds you want to have after the call is made
//       } as CallMaker,
//       {
//         name: "call_template_2",
//         // description: "optional string"
//         as: account_two,
//         amount: new Tez(10),
//         call: (cp) => bid_contract.make_offer(manual_fill_first_parameter, manual_fill_second_parameter, cp),
//         delay_after: 150
//       } as CallMaker,
//     ],
//     //Don't plug the test data array into the testDataArray parameter directly
//     //- it has to be in the top level of the describe block, or mocha won't be able to handle it
//     testDataArray,
//     //Optional parameter "quiet" will remove all console.log statements from the test
//     // "quiet"
//   )
//   })

//   //LIST OF ACCOUNTS TO TEST AND EXPECTED CHANGES

//   let testDataArray : Array<testParams> = [{
//     description: "template",
//     account: account_one,
//     expected_change: 1, // you can just enter a number in units of tez, it will be converted to a mutez bigNumber
//   } as testParams,
//   {
//     description: "minter_one recieves 1/100 of bid as minter_fee",
//     account: account_two,
//     expected_change: 0.1
//   } as testParams
//   ]

//   //EXECUTE TESTS FROM ARRAY.
//   for (const tp of testDataArray) {
//     it(`${tp.description}`, async function() {
//       this.tp = tp
//             assert(tp.difference.isLessThanOrEqualTo(tp.tolerance), tp.error_message)
//         })
//       }

//   afterEach(async function() {
//     if (this.currentTest) {
//       log_messages(this.tp, this.currentTest.state)        }
//   })
// })
