function getPartsOfArray(array, threads) {
  if (Number.isNaN(array.length / threads) ) {
    console.log('could not be run');
    return false
  }else if(threads > array.length){
    return array
  } else {
    const resultRestDivision = array.length % threads;
    const resultDivisionInt = parseInt(array.length / threads);

    let test = array;
    let newArray = [];
    let aux = 0;

    for (let i = 1; i <= threads; i++) {
      if (i == threads && resultRestDivision) {
        newArray.push(
          test.slice(aux, resultDivisionInt * i + resultRestDivision)
        );
      } else {
        newArray.push(test.slice(aux, resultDivisionInt * i));
        aux = resultDivisionInt * i;
      }
    }
    return newArray
  }
}

module.exports = { getPartsOfArray };
