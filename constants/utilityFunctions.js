//transforms Google response objects
const transform = googleResObj => {
  let returnArr = [];
  if (googleResObj.responses[0].labelAnnotations.error) {
    return false;
  }
  googleResObj.responses[0].labelAnnotations.forEach(elem =>
    returnArr.push(elem.description)
  );
  return returnArr;
};

//helperFunc for isThisADog
const isDog = elem => {
  if (elem === 'Dog') return elem;
};

//Returns false if it is Not A Dog
const isThisADog = transformResponse => {
  let filter = transformResponse.findIndex(isDog);
  if (filter !== -1) {
    return transformResponse.slice(filter + 1);
  }
  return 'Not a dog';
};

//Finds the breed if it is a dog + breed exists in breed list
const breedFinder = (isThisADogResponse, breedList) => {
  for (let i = 0; i <= isThisADogResponse.length; i++) {
    let label = isThisADogResponse[i];
    for (let j = 0; j < breedList.length; j++) {
      let breed = breedList[j];
      console.log(breed);
      if (label === breed) {
        return breed;
      }
    }
  }
  return '🐶 breed not found';
};

//Combines all above functions, either returns false (not a dog), breed, or 🐶 breed not found
export const dogResponseComboFunction = (googleResObj, breedList) => {
  let transformed = transform(googleResObj);
  if (transformed === false) {
    return 'Something has gone wrong.';
  }
  let isThisADogResponse = isThisADog(transformed);
  if (isThisADogResponse !== 'Not a dog') {
    return breedFinder(isThisADogResponse, breedList);
  }
  return isThisADogResponse;
};

//change breed to name of breed document
export const dogDocer = breedString => {
  let newBreed = breedString.toLowerCase().replace(' ', '-');
  return newBreed;
};
