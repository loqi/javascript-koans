var _; //globals

describe("About Applying What We Have Learnt", function() {

  var products;

  beforeEach(function () { 
    products = [
       { name: "Sonoma", ingredients: ["artichoke", "sundried tomatoes", "mushrooms"], containsNuts: false },
       { name: "Pizza Primavera", ingredients: ["roma", "sundried tomatoes", "goats cheese", "rosemary"], containsNuts: false },
       { name: "South Of The Border", ingredients: ["black beans", "jalapenos", "mushrooms"], containsNuts: false },
       { name: "Blue Moon", ingredients: ["blue cheese", "garlic", "walnuts"], containsNuts: true },
       { name: "Taste Of Athens", ingredients: ["spinach", "kalamata olives", "sesame seeds"], containsNuts: true }
    ];
  });

  /*********************************************************************************/

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (imperative)", function () {

    var i,j,hasMushrooms, productsICanEat = [];

    for (i = 0; i < products.length; i+=1) {
        if (products[i].containsNuts === false) {
            hasMushrooms = false;
            for (j = 0; j < products[i].ingredients.length; j+=1) {
               if (products[i].ingredients[j] === "mushrooms") {
                  hasMushrooms = true;
               }
            }
            if (!hasMushrooms) productsICanEat.push(products[i]);
        }
    }

    expect(productsICanEat.length).toBe(1);
  });

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (functional)", function () {
    var productsICanEat = products.filter( function (prod){
      return !(
        prod.containsNuts ||
        prod.ingredients.some(function (ing) { return ing==='mushrooms'; }) ); });
    expect(productsICanEat.length).toBe(1);
  });

  /*********************************************************************************/

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (imperative)", function () {
    
    var sum = 0;
    for(var i=1; i<1000; i+=1) {
      if (i % 3 === 0 || i % 5 === 0) {
        sum += i;
      }
    }
    
    expect(sum).toBe(233168);
  });

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (functional)", function () {
    var nums1to999 = [];  for (var i=1; i<1000; i++) { nums1to999.push(i); } // TODO: There's probably a better way to do this.
    var sum = nums1to999.reduce(function (sum, i){ return sum + (i%3===0 || i%5===0 ? i : 0); }, 0);
    expect(233168).toBe(sum);
  });

  /*********************************************************************************/
   it("should count the ingredient occurrence (imperative)", function () {
    var ingredientCount = { "{ingredient name}": 0 };
    for (i = 0; i < products.length; i+=1) {
        for (j = 0; j < products[i].ingredients.length; j+=1) {
            ingredientCount[products[i].ingredients[j]] = (ingredientCount[products[i].ingredients[j]] || 0) + 1;
        }
    }
    expect(ingredientCount['mushrooms']).toBe(2);
  });

  it("should count the ingredient occurrence (functional)", function () {
    ingredientCount = products.reduce(function (histogram, product){
      return product.ingredients.reduce(function (histogram, ingredient) {
        histogram[ingredient] = histogram.hasOwnProperty(ingredient) ? histogram[ingredient]+1 : 1;
        return histogram; }, histogram); }, {});
    expect(ingredientCount['mushrooms']).toBe(2);
  });




  /*********************************************************************************/
  /* UNCOMMENT FOR EXTRA CREDIT */



//////////////////////////////////////////////////////////////////////////////
// I spent some time making prime number utilities in JavaScript.
// They have a high speed-to-inscrutability ratio.
// Awesome.
// The indentation is off, and I possibly misused used `this` before the lecture.
var primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101];
primes.limit = 65536; // Memoization limit
primes.last = function() { return this[this.length-1]; }
primes.append = function(newLast) { if (this.length < this.limit) { this.push(newLast); } return newLast; }
primes.reaches = function(n) { return n <= this.last(); }
primes.ordinality = function(n) { var lef = 0, rig = this.length-1; // ordinality(10) => 4.5 (i.e. between 4th and 5th)
  if (n >= this[rig]) return rig + (n===this[rig] ? 1 : 1.5);
  while (lef < rig) { mid = Math.floor((rig-lef)/2) + lef;
    if (this[mid]===n) return mid+1;
    if (this[mid] < n) lef = mid+1; else rig = mid-1; }
  return mid + (this[mid]<n ? 2.5 : 1.5); }
primes.has = function(n) { var place = this.ordinality(n); return place==Math.floor(place); }
var nxPrimeTab = primes.reduce(function(arr, p){ for (var c = p - arr.length; c ; c--) arr.push(p); return arr; }, []);

// Max time complexity: O(sqrt(n))
function greatestPrimeFactor(num) { // Returns 1 unless `num` is an integer >= 2
  if (isNaN(num) || num < 0 || num != Math.floor(num)) return 1; // TODO: expeption instead?
  if (num <= 12) return [1,1,2,3,2,5,3,7,2,3,5,11,3][num];
  var gpf = 1, n = num; d = 2, lim = Math.floor(Math.sqrt(n));
  // For d in 2..sqrt(num) { on each divisibility hit, `pf` grows and `n` shrinks. }
  while (n > 1 && d <= lim) { while (n%d===0){n/=(gpf=d);} d = d<nxPrimeTab.length ? nxPrimeTab[d] : d+2; }
  return n > gpf ? n : gpf; }

// Max time complexity: O(sqrt(n))  -- 
function primeFactorArray(num) { // (NaN)=>[] (0)=>[0] (1)=>[] (neg)=>[-1,primes] (6.9)=>[2,3] (-6.9)=>[-1,2,3] (-0.9)=>[-1,0]
  if (isNaN(num)) return []; // TODO: expeption instead?
  var pfa = [];
  if (num < 0) { num = -num ; pfa.push(-1); }
  num = Math.floor(num);
  if (num <= 3) { return num!=1 ? (pfa.push([0,1,2,3][num]),pfa) : pfa; }
  var n = num; d = 2, lim = Math.floor(Math.sqrt(n));
  while (n > 1 && d <= lim) { while (n%d===0){n/=(pfa.push(d),d);} d = d<nxPrimeTab.length ? nxPrimeTab[d] : d+2; }
  if (n>1) pfa.push(n); // pfa will be in ascending sequence, except possibly the last element.
  return pfa; }

function primeFactorHistogram(num) {
  return primeFactorArray(num).reduce(function(h,pN){
    pS = ''+pN; h[pS] = (h.hasOwnProperty(pS)?h[pS]:0) + 1 ;return h}, {}); }

// Max time complexity: O(sqrt(n))
function isPrime(num) { var n = Number(num);
  if (n < 2 || n !== Math.floor(n)) return false;
  if (n === 2 || n === 3) return true;
  if (n%2===0 || n%3===0) return false;
  // num is an integer >= 5 and not divisible by 2 or 3.
  if (primes.reaches(n)) { return primes.has(n); }
  // Use the 6*k +- 1 method for every k < sqrt(num)
  var sqrtNum = Math.sqrt(n);
  var maxDivBy = Math.floor(sqrtNum);
  if (sqrtNum === maxDivBy) return false;
  for (var divBy = 5; divBy <= maxDivBy; divBy += 6)
    if (n%divBy===0 || n%(divBy+2)===0) return false;
  return true; }

// Max time complexity: O( (nextPrime(n)-n) * sqrt(n) )
function nextPrime(num) { var n = Math.floor(Number(num)); // nextPrime(2.99) == nextPrime(2.00)
  if (n < nxPrimeTab.length) return (n>1 ? nxPrimeTab[n] : 2);
  if (primes.reaches(n)) {
    ord = primes.ordinality(n);
    if (ord < primes.length) return primes[Math.floor(ord)]; }
  while (!isPrime(  n += (n%2===0) ? 1 : 2  )) {}
  primes.append(n);
  return n; }

// Max time complexity: O(n * sqrt(n))
function nthPrime(n) { var n = Math.floor(Number(n));
  if (n <= primes.length) return n<1 ? 1 : primes[n-1];
  var prime = primes.last();
  for (var i = primes.length ; i < n ; i++) {
    prime = nextPrime(prime); }
  return prime; }

// Max time complexity: O(numAr.length * sqrt(numAr element))
function leastCommonMultiple(numAr) { // TODO: Handle negatives
  primeMax = numAr.reduce(function(pm, num){ // primeMax = {prime : max_count_of_this_prime_factor_of_any_numAr_element, ...}
    var fta = primeFactorHistogram(num); // fundamental_theorem_of_arithmetic_factorization = { prime: exponent_of_the_prime ...}
    for (var pS in fta) { if (!isNaN(pS)) { pm[pS] = Math.max(pm.hasOwnProperty(pS)?pm[pS]:0, fta[pS]); } }
    return pm; } ,{});
  var lcm = 1;for(var pS in primeMax) { isNaN(pS) || (lcm *= Math.pow(+pS,primeMax[pS])); } // lcm = build the least common multiple.
  return lcm; }

function squareOfSumMinusSumOfSquares(numAr) {
  var n=0, sum=0, sumOfSq=0;
  for (var i=0 ; i<numAr.length ; i++) { n = numAr[i];  sum += n;  sumOfSq += n*n; }
  return sum*sum - sumOfSq; }

function naturalSquareOfSumMinusSumOfSquares(n) { // Assumes n is a positive integer.
  return (3*n*n + 2*n) * (n*n - 1) / 12; }

// Given a parameter `x`, return true if x.toString is a character-level palendrome.
function isPalendrome(stringish) { // TODO: could be more efficient.
  return stringish.toString().split('').reverse().join('') == stringish; }
function isPalendromicNum(n) { // FIXME: Technically, 10 is palendromic because 10 == 010
  return isPalendrome(parseInt(n)); } // TODO: is probably quicker and more reliable to do arithmetically.

// Given two positive integers, mx1 and mx2, find two numbers, y1 and y2, such
// that: y1 <= mx1; AND y2 <= mx2; AND criterionFunc(y1*y2) returns truish; AND
// there exists no passing pair of values (y1', y2') whose product is greater.
// Return them as an ascending-sorted array [y1, y2], where y1 <= y2.
function greatestPassingMulPair(mx1, mx2, criterionCallback) {
  // TODO: Rewrite this code in a less naive way using a series of subtraction.
  criterionCallback = criterionCallback || function(val) { return !!val; }
  var x, y, prod, biggest = 0, rval = [0,0];
  for (y1 = mx1 ; y1 > 0 ; y1--) {
    for (y2 = mx2 ; y2 >= y1 ; y2--) {
      if (y1*y2 > biggest) { prod = y1*y2;
        if (criterionCallback(prod)) {
          biggest = prod;  rval = [y1,y2];} } } }
  return rval[0] <= rval[1] ? rval : rval.reverse(); }

//////////////////////////////////////////////////////////////////////////////

  it("should find the largest prime factor of a composite number", function () {
    expect(greatestPrimeFactor(  2)).toBe(2);
    expect(greatestPrimeFactor(  3)).toBe(3);
    expect(greatestPrimeFactor(  4)).toBe(2);
    expect(greatestPrimeFactor( 11)).toBe(11);
    expect(greatestPrimeFactor( 12)).toBe(3);
    expect(greatestPrimeFactor( 13)).toBe(13);
    expect(greatestPrimeFactor( 14)).toBe(7);
    expect(greatestPrimeFactor(306)).toBe(17);
    expect(greatestPrimeFactor(307)).toBe(307);
    expect(greatestPrimeFactor(308)).toBe( 11);
    expect(greatestPrimeFactor( 179424672)).toBe(5449);
    expect(greatestPrimeFactor( 179424673)).toBe(179424673);
    expect(greatestPrimeFactor( 179424674)).toBe(4789);
    expect(greatestPrimeFactor(5112733756)).toBe(147409);
    expect(greatestPrimeFactor(5112733757)).toBe(5112733757);
    expect(greatestPrimeFactor(5112733758)).toBe(6271);
  });

  it("should find the largest palindrome made from the product of two 3 digit numbers", function () {
    expect(isPalendromicNum(0)).toBe(true);
    expect(isPalendromicNum(9)).toBe(true);
    expect(isPalendromicNum(33)).toBe(true);
    expect(isPalendromicNum(303)).toBe(true);
    expect(isPalendromicNum(3993)).toBe(true);
    expect(isPalendromicNum(302575203)).toBe(true);

    numPair = greatestPassingMulPair(999, 999, isPalendromicNum); // [913,993] :: 906609
    expect(numPair[0]).toBe(913);
    expect( numPair[1] ).toBe(993);

    numPair = greatestPassingMulPair(99, 999, isPalendromicNum); // [91,99] :: 94149
    expect(numPair[0]).toBe(99);
    expect(numPair[1]).toBe(951);

    numPair = greatestPassingMulPair(99, 99, isPalendromicNum); // [91,99] :: 9009
    expect(numPair[0]).toBe(91);
    expect(numPair[1]).toBe(99);

  });

  it("should find the smallest number divisible by each of the numbers 1 to 20", function () {
    expect(leastCommonMultiple([])).toBe(1);
    expect(leastCommonMultiple([0])).toBe(0);
    expect(leastCommonMultiple([1])).toBe(1);
    expect(leastCommonMultiple([1,0])).toBe(0);
    expect(leastCommonMultiple([0,1])).toBe(0);
    expect(leastCommonMultiple([8])).toBe(8);
    expect(leastCommonMultiple([8,4])).toBe(8);
    expect(leastCommonMultiple([5,1,1,7])).toBe(35);
    expect(leastCommonMultiple([5,1,0,0,1,3])).toBe(0);
    expect(leastCommonMultiple([1,2])).toBe(2);
    expect(leastCommonMultiple([1,2,3])).toBe(6);
    expect(leastCommonMultiple([1,2,3,4])).toBe(12);
    expect(leastCommonMultiple([1,2,3,4,5])).toBe(60);
    expect(leastCommonMultiple([1,2,3,4,5,6])).toBe(60);
    expect(leastCommonMultiple([1,2,3,4,5,6,7])).toBe(420);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8])).toBe(840);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9])).toBe(2520);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9,10])).toBe(2520);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9,10,11])).toBe(27720);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9,10,11,12])).toBe(27720);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9,10,11,12,13])).toBe(360360);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9,10,11,12,13,14])).toBe(360360);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])).toBe(360360);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])).toBe(232792560);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])).toBe(232792560);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21])).toBe(232792560);
    expect(leastCommonMultiple([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22])).toBe(232792560);
    expect(leastCommonMultiple(_.range(1,46))).toBe(9419588158802422000);
  });
  
  it("should find the difference between the sum of the squares and the square of the sums", function () {
    expect(squareOfSumMinusSumOfSquares(_.range(1,11))).toBe(2640);
    expect(naturalSquareOfSumMinusSumOfSquares(10)).toBe(2640);
    expect(squareOfSumMinusSumOfSquares(_.range(1,101))).toBe(25164150);
    expect(naturalSquareOfSumMinusSumOfSquares(100)).toBe(25164150);
  });

  it("should find the 10001st prime", function () {
    expect(nthPrime( 1)).toBe(2);
    expect(nthPrime( 2)).toBe(3);
    expect(nthPrime( 3)).toBe(5);
    expect(nthPrime(28)).toBe(107);
    expect(nthPrime(20)).toBe(71);
    expect(nthPrime(   1001)).toBe(7927);
    expect(nthPrime(  10001)).toBe(104743);
    expect(nthPrime( 100001)).toBe(1299721);
  });

});
