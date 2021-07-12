
function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}


const convertCurrency = function (amt, to, from) {
    var convertedAmt
    if (from == "INR" && to == "USD") {
        convertedAmt = amt / 74.49
    }
    if (from == "USD" && to == "INR") {
        convertedAmt = amt * 74.49
    }
    if (from == "INR" && to == "EUR") {
        convertedAmt = amt / 88.47
    }
    if (from == "EUR" && to == "INR") {
        convertedAmt = amt * 88.47
    }
    if (from == "INR" && to == "INR") {
        convertedAmt = amt
    }
    return round(convertedAmt)
}

module.exports = { convertCurrency }