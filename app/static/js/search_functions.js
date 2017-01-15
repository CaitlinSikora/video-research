function getMostCommon(array) {
  var count = {};
  array.forEach(function (a) {
      count[a] = (count[a] || 0) + 1;
  });
  return Object.keys(count).reduce(function (r, k, i) {
      if (!i || count[k] > count[r[0]]) {
          return [k,count[k]];
      }
      if (count[k] === count[r[0]]) {
          r.push(k);
      }
      return [r,count[r]];
  }, []);
}

function getMaxOccurrence(a) {
    var o = {}, mC = 0, mV, m;
    for (var i=0, iL=a.length; i<iL; i++) {
        m = a[i];
        o.hasOwnProperty(m)? ++o[m] : o[m] = 1;
        if (o[m] > mC) mC = o[m], mV = m;
    }
    return [mV,mC];
}

function getByValue(arr, value) {
  var result  = arr.filter(function(o){return o.video == value;} );
  return result? result[0] : null; // or undefined
}

function unique(a) {
  var seen = {};
  return a.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

function precise_round(value, decPlaces){
    var val = value * Math.pow(10, decPlaces);
    var fraction = (Math.round((val-parseInt(val))*10)/10);
    if(fraction == -0.5) fraction = -0.6;
    val = Math.round(parseInt(val) + fraction) / Math.pow(10, decPlaces);
    return val;
}
