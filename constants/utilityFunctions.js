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

// Combines unique dogs from two different arrays (i.e. user's collected dogs vs. database dogs), prioritizes the user's collected dogs
export const homeScreenDogs = (userDogs, allDogs) => {
  const uniqueDogs = userDogs;
  allDogs.forEach(dog => {
    for (let i = 0; i < userDogs.length; i++) {
      if (dog.key === userDogs[i].key) {
        return;
      }
    }
    uniqueDogs.push(dog);
  });
  return uniqueDogs;
};

// edits breed name for dynamic URL (Boston Terrier -> BOSTON+TERRIER)
export const slugify = (str, delimeter="+") => {
  str = str
    .replace(/ +/g, delimeter) //replace spaces with delimeter
    .toUpperCase();

  return str;
}

// safer String.prototype.toLowerCase()
const lowerCase = str => {
  return str.toLowerCase();
}

// safer String.prototype.toUpperCase()
const upperCase = str => {
  return str.toUpperCase();
}

// capitalizes first letter of each word
export const properCase = str => {
  return lowerCase(str).replace(/^\w|\s\w/g, upperCase);
}

// capitalize first letter of every sentence and lowercase other chars.
export const sentenceCase = str => {
  // Replace first char of each sentence (new line or after '.\s+') to
  // UPPERCASE
  return lowerCase(str).replace(/(^\w)|\.\s+(\w)/gm, upperCase);
}
