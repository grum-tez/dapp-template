import { ArchetypeType, Rational, Duration, date_cmp, Tez, Bytes, Address, Nat, Enum } from '@completium/archetype-ts-types';
const assert = require('assert')

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


type PreTable = Array<{[key:string] : string}>
type StringArray = Array<string>

const data : PreTable = [
  { name: '0', value: ' ', class: 'String' },
  {
    name: '1',
    value: '697066733a2f2f62616679626569677a7066737276766233696672666534746d61686d656e756633666c6279686935793476366734666e3670717069716434777779',
    class: 'Bytes'
  }
]

type prims = string | TezDate | Tez | Duration | Date | Rational | Address | Nat | Bytes 

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

export const assetToPreTable = (asset: object | undefined) : PreTable => {

if (asset === undefined) { 
  console.log ("the asset is undefined and cannot be printed"); 
  return []
}

try {
  assert(!(asset instanceof Array), "This isn't an asset - it might be a map")
} catch (error) {console.error(error)}

let data: PreTable = []
for (const [key, value] of Object.entries(asset)) {
  // if value is of the prims type then print it as a string, else print the type nam

  if (isPrims(value)) {
    data.push({name: key, value: valAsString(value), class: value.constructor.name})
  } else if (value instanceof Enum) {
    data.push({name: key, value: `${valAsString(value.type())} (type)` , class: "Enum"})
  } else if (value instanceof Array) {
    data.push({name: key, value: `Array type` , class: "Array (map, bigmap)"})
  } else {
    data.push({name: key, value: 'unknown type', class: 'unknown type'})
    console.log(typeof value)
  }
}
console.log('data', data)
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

const prepArray = (arr: StringArray, maxLength:number = 15) => {
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

createTableColumn(data)