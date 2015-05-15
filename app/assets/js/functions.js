function getRandom(length) {
  if (!length) {
    length = 10;
  }
  var rand = Math.floor(Math.random() * length);
  return rand;
}

function inArray(value, array) {
  if ($.inArray(value, array) > -1) {
    return true;
  } else {
    return false;
  }
}

function getThree(number) {
  var array = [];
  var rand;

  if (!number) {
    number = 3;
  }

  // Loop through and choose numbers
  for (var i = 1; i <= number; i++) {
    rand = getRandom(10);
    array.push(rand);
  };
  return array;
}

function Shuffle(o) {
  for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};
