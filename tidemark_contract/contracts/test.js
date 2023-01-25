// Javascript implementation of the approach

// Recursive function that returns
// square root of a number with
// precision upto 5 decimal places
function Square(n, i, j) {
  console.log('n: ', n, 'i: ', i, 'j :', j)
  var mid = (i + j) / 2
  var mul = mid * mid

  // If mid itself is the square root,
  // return mid
  if (mul == n || Math.abs(mul - n) < 0.00001) return mid
  // If mul is less than n,
  // recur second half
  else if (mul < n) return Square(n, mid, j)
  // Else recur first half
  else return Square(n, i, mid)
}

// Function to find the square root of n
function findSqrt(n) {
  var i = 1

  // While the square root is not found
  var found = false
  while (!found) {
    // If n is a perfect square
    if (i * i == n) {
      document.write(i)
      found = true
    } else if (i * i > n) {
      // Square root will lie in the
      // interval i-1 and i
      var res = Square(n, i - 1, i)
      console.log(res.toFixed(5))
      found = true
    }
    i++
  }
}

// Driver code
var n = 0.3

Square(0.3, 0.3, 1)
// findSqrt(n)

// function square_root(N) {
//   // Find MSB(Most significant Bit) of N
//   let msb = parseInt(Math.log2(N))

//   // (a = 2^msb)
//   let a = 1 << msb
//   let result = 0
//   while (a != 0) {
//     // Check whether the current value
//     // of 'a' can be added or not
//     if ((result + a) * (result + a) <= N) {
//       result += a
//     }

//     // (a = a/2)
//     a >>= 1
//   }

//   // Return the result
//   return result
// }

// let N = 0.36

// // Function call
// let ans = square_root(N)
// console.log(ans)
