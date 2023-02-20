import * as att from "@completium/archetype-ts-types";
import { ArchetypeType, Rational, Duration, date_cmp, Tez, Bytes, Address, Nat, Enum } from '@completium/archetype-ts-types';
import { tidemark_fa2} from './binding/tidemark_fa2'
import {get_account, set_mockup, set_mockup_now, set_quiet, delay_mockup_now_by_minute, delay_mockup_now_by_week} from "@completium/experiment-ts";
import { expect_to_fail } from '@completium/experiment-ts';
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


type prims = string | TezDate | Tez | Duration | Date | Rational | Address | Nat | Bytes 
type PreTable = Array<{[key:string] : string}>
type StringArray = Array<string>


function isPrims(value: any): value is prims {
  return (
  typeof value === 'string' ||
  value instanceof TezDate ||
  value instanceof Tez ||
  value instanceof Duration ||
  value instanceof Date ||
  value instanceof Rational ||
  value instanceof Address ||
  value instanceof Nat ||
  value instanceof Bytes
  )}

const valAsString = 
(val : prims) => {
    if (typeof val === 'string') {
      return val 
    } else {
    return val.toString()
  }
} 

const varNameToString = (varObj: any) => Object.keys(varObj)[0]

const logPrim = (input : any) => {
  if (input === undefined) {
    console.log(`the input is undefined and cannot be printed`)
  } else if (isPrims(input)) {
    console.log (`${varNameToString} : ${valAsString(input)} : ${input.constructor.name}`)
  } else {
    console.log(`the input is not a prims. It is a: ${input.constructor.name} \n ${input}`)
}
}


const containerToPreTable = (title: string, container: object | undefined) : PreTable => {

  if (container === undefined) { 
    console.log ("the container is undefined and cannot be printed"); 
    return []
  }
  let data: PreTable = []

  if (container instanceof Array<[prims]>) {
    console.log(`\n${title} : Map\n`)
    data = container.map((arr) => {
      return {
        [arr[0].constructor.name]: valAsString(arr[0]),
        [arr[1].constructor.name]: valAsString(arr[1])
      }
    })
  } else {
    console.log(`\n${title} : ${container.constructor.name}\n`)

      for (const [key, value] of Object.entries(container)) {
        // if value is of the prims type then print it as a string, else print the type nam
      
        if (isPrims(value)) {
          data.push({name: key, value: valAsString(value), class: value.constructor.name})
        } else if (value instanceof Enum) {
          data.push({name: key, value: `${valAsString(value.type())} (type)` , class: "Enum"})
        } else if (value instanceof Array) {
          data.push({name: key, value: `Array type` , class: "Array (map, bigmap)"})
          data.push({name: key, value: `${value.constructor.name}` , class: "bid_history_value"})
        } else {
          data.push({name: key, value: 'unknown type', class: `${value.constructor.name}`})
        }
      }
    }
  return data
  }

  const createTableColumn = (data: PreTable) => {
  
  const areKeysSame = (data: PreTable) => {
    let keys = new Set()
    for (const obj of data) {
      const objKeys = Object.keys(obj)
      for (const key of objKeys) {
        keys.add(key)
      }
    }
    return (keys.size === Object.keys(data[0]).length)
  }
  
  try {
    assert(areKeysSame(data), `the keys are not the same`)
  } catch(err) {
    console.error(err)
  }
   
  const stringMatrix = Object.keys(data[0]).map(key => {
    let arr : StringArray = []
    for (const obj  of data) {
      arr.push(obj[key])
    } 
    return [key].concat(arr)
  })
  
  const transposeMatrix = (matrix: string[][]): string[][] =>
  matrix[0].map((_, i) => matrix.map(row => row[i]));
  
  const prepArray = (arr: StringArray, maxLength:number = 30) => {
    const limitLength = (str: string) => 
      str.length > maxLength ? str.substring(0, maxLength - 3) + `... ${str.length}}` : str
    
    const arrLimited = arr.map(item => limitLength(item))
    
    const minLength = arrLimited.reduce((acc, curr) => {
    return Math.max(acc, curr.length)}, 0)
  
    const arrPadded = arrLimited.map(item => item.padEnd(minLength))
    return arrPadded
  
  }
  
  const preppedMatrix = stringMatrix.map(arr => prepArray(arr))
  
  const transposedMatrix = transposeMatrix(preppedMatrix)
  
  const borders = Array(transposedMatrix.length).fill('|')
  const intersperse = (inter: any[], arr: any[]) =>
  arr.reduce((acc, cur, i) => acc.concat([inter[i], cur]), []);
  
  const addLine = (matrix: string[][]): string[][] => {
    const firstRow = matrix[0]
    const spacedRow = firstRow.map(str => str.replace(/[^|]/g, " "))
    const linedRow = spacedRow.map(str => str.replace(/ /g, "-"))
    matrix.splice(1,0, linedRow)
    return matrix
  }
  
  const penultimateMatrix = transposedMatrix.map(arr => intersperse(borders, arr).concat('|'))
  const finalMatrix = addLine(penultimateMatrix)
  
  for (const arr of finalMatrix) {
    console.log(arr.join(' '))
  }  
  }
  
  function logContainer(title : string, container: object | undefined) {
    const data = containerToPreTable(title, container)
    createTableColumn(data)
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

      const ledger_value_one = await tidemark_fa2.get_ledger_value(new Nat(1))
      console.log('after mint: ', ledger_value_one)

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
 

describe('[make_offer] entrypoint', async () => {
  it('Does not fail with correct inputs', async () => {

    await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(4), {as: collector_one, amount: new Tez(4)})
    delay_mockup_now_by_minute(50)
  })

it('Second lower offer fails', async () => {
  expect_to_fail(async () => {
  await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(3), {as: collector_two, amount: new Tez(3)})
  }, att.string_to_mich("incoming bid must be greater than current bid"))
  delay_mockup_now_by_minute(500)

})

it('Second higher offer succeeds', async () => {
  await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(10), {as: collector_one, amount: new Tez(10)})
  const ledger_value_one = await tidemark_fa2.get_ledger_value(new Nat(1))
  logContainer("ledger_value_one", ledger_value_one)
  const bid_history = await tidemark_fa2.get_bid_asset()
  logContainer("bid_history", bid_history)
  delay_mockup_now_by_minute(400)

  })

  it('Third higher offer succeeds', async () => {
    await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(16), {as: collector_one, amount: new Tez(16)})
    const ledger_value_one = await tidemark_fa2.get_ledger_value(new Nat(1))
    logContainer("ledger_value_one", ledger_value_one)
    const bid_history = await tidemark_fa2.get_bid_asset()
    delay_mockup_now_by_minute(800)

    
    })
})

describe('[sell] entrypoint', async () => {
  it('Does not fail with correct inputs', async () => {

    await tidemark_fa2.sell(new Nat(1), {as: creator_one})
    const ledger_value_one = await tidemark_fa2.get_ledger_value(new Nat(1))
    logContainer("ledger_value_one", ledger_value_one)
    console.log(ledger_value_one?.l_bid_number.toString())
  delay_mockup_now_by_minute(500)

  })

// OWNER IS NOW COLLECTOR_ONE
  it('Can be bought and sold a few times without error', async () => {
    await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(5), {as: collector_three, amount: new Tez(5)})
    await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(30), {as: collector_two, amount: new Tez(30)})
    await tidemark_fa2.sell(new Nat(1), {as: collector_one})
  delay_mockup_now_by_minute(200)

//OWNER IS NOW COLLECTOR_TWO
    await tidemark_fa2.make_offer(new Nat(1), marketplace_three_address, new Tez(80), {as: collector_one, amount: new Tez(80)})
    await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(120), {as: collector_three, amount: new Tez(120)})
    await tidemark_fa2.sell(new Nat(1), {as: collector_two})
  delay_mockup_now_by_minute(5000)



//OWNER IS NOW COLLECTOR_THREE
    await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(180), {as: collector_one, amount: new Tez(180)})
    await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(230), {as: owner_one, amount: new Tez(230)})
    await tidemark_fa2.sell(new Nat(1), {as: collector_three})

//OWNER IS NOW OWNER_ONE
delay_mockup_now_by_minute(50)
    await tidemark_fa2.make_offer(new Nat(1), marketplace_one_address, new Tez(20), {as: collector_one, amount: new Tez(20)})
    await tidemark_fa2.make_offer(new Nat(1), marketplace_two_address, new Tez(500), {as: owner_two, amount: new Tez(220)})
    await tidemark_fa2.sell(new Nat(1), {as: owner_one})

//OWNER IS NOW OWNER_TWO

const fair_burden_by_id_map_out = await tidemark_fa2.get_fair_burden_by_id_map_out()
console.log("fair_burden_by_id_map_out")
for (const arr of fair_burden_by_id_map_out) {
  console.log(arr[0].toString(), " : ",  tezAsString(arr[1]))
}

const get_refund_due_out = await tidemark_fa2.get_refund_due_out()
console.log("get_refund_due_out")
for (const arr of get_refund_due_out) {
  console.log(arr[0].toString(), " : ",  tezAsString(arr[1]))
}

})
})

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
