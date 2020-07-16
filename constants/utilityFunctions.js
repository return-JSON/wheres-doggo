//transforms Google response objects
const transform = (googleResObj) => {
  let returnArr = [];
  if (googleResObj.responses[0].labelAnnotations.error) {
    return false;
  }
  googleResObj.responses[0].labelAnnotations.forEach((elem) =>
    returnArr.push(elem.description)
  );
  return returnArr;
};

//helperFunc for isThisADog
const isDog = (elem) => {
  if (elem === 'Dog') return elem;
};

//Returns false if it is Not A Dog
const isThisADog = (transformResponse) => {
  let filter = transformResponse.findIndex(isDog);
  if (filter !== -1) {
    return transformResponse;
  }
  return 'Not a dog';
};

//Finds the breed if it is a dog + breed exists in breed list
const breedFinder = (isThisADogResponse, breedList) => {
  for (let i = 0; i <= isThisADogResponse.length; i++) {
    let label = isThisADogResponse[i];
    for (let j = 0; j < breedList.length; j++) {
      let breed = breedList[j];
      if (label === breed || label === breed + ' dog') {
        return breed;
      }
    }
  }
  return '🐶 breed not found';
};

//Combines all above functions, either returns false (not a dog), breed, or 🐶 breed not found
export const googleResponseProcessor = (googleResObj, breedList) => {
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
export const dogBreedIdCreator = (breedString) => {
  const regex = / /gi;
  let newBreed = breedString.toLowerCase().replace(regex, '-');
  return newBreed;
};
export const urlMaker = (breedString) => {
  const regex = / /gi;
  let newBreed = breedString.replace(regex, '%20');
  return newBreed;
};

// Combines unique dogs from two different arrays (i.e. user's collected dogs vs. database dogs), prioritizes the user's collected dogs
export const homeScreenDogs = (userDogs, allDogs) => {
  const uniqueDogs = userDogs;
  allDogs.forEach((dog) => {
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
export const slugify = (str, delimeter = '+') => {
  str = str
    .replace(/ +/g, delimeter) //replace spaces with delimeter
    .toUpperCase();

  return str;
};

// safer String.prototype.toLowerCase()
const lowerCase = (str) => {
  return str.toLowerCase();
};

// safer String.prototype.toUpperCase()
const upperCase = (str) => {
  return str.toUpperCase();
};

// capitalizes first letter of each word
export const properCase = (str) => {
  return lowerCase(str).replace(/^\w|\s\w/g, upperCase);
};

// capitalize first letter of every sentence and lowercase other chars.
export const sentenceCase = (str) => {
  // Replace first char of each sentence (new line or after '.\s+') to
  // UPPERCASE
  return lowerCase(str).replace(/(^\w)|\.\s+(\w)/gm, upperCase);
};

//Scoreboard utility function
const pointsToZero = (arr) => {
  arr.map((elem) => {
    if (!elem.points) {
      elem.points = 0;
    }
  });
  return arr;
};

//if you have 0 points, you don't get to be on the board bruh
const filterForZero = (arr) => {
  arr = arr.filter((elem) => {
    if (elem.points !== 0) return elem;
  });
  return arr;
};

const sortByValue = (arr) => {
  arr = arr.sort((a, b) => (a.points < b.points ? 1 : -1));
  return arr;
};

export const scoreBoardCombo = (arr) => {
  let newArr = sortByValue(filterForZero(pointsToZero(arr)));
  return newArr;
};

export const breedFreq = (arr) => {
  let breedList = [];
  arr.forEach((dog) => {
    const i = breedList.findIndex((x) => x.breed === dog.breed);
    if (i <= -1) breedList.push({ breed: dog.breed, count: 1 });
    else breedList[i].count++;
  });
  return breedList;
};

export const editCity = (arr) => {
  return arr.forEach((dog) => {
    if (dog.city === 'New York, New York') {
      if (dog.county === 'New York County')
        dog.boroughOrCity = 'Manhattan, New York';
      else if (dog.county === 'Kings County')
        dog.boroughOrCity = 'Brooklyn, New York';
      else if (dog.county === 'Queens County')
        dog.boroughOrCity = 'Queens, New York';
      else if (dog.county === 'Richmond County')
        dog.boroughOrCity = 'Staten Island, New York';
      else if (dog.county === 'Bronx County')
        dog.boroughOrCity = 'Bronx, New York';
      else dog.boroughOrCity = dog.city;
    } else {
      dog.boroughOrCity = dog.city;
    }
  });
};

export const geoBreedFreq = (arr) => {
  let list = [];
  arr.forEach((dog) => {
    const i = list.findIndex(
      (x) => x.boroughOrCity === dog.boroughOrCity && x.breed === dog.breed
    );
    if (i <= -1) {
      list.push({
        boroughOrCity: dog.boroughOrCity,
        breed: dog.breed,
        count: 1,
      });
    } else {
      list[i].count++;
    }
  });
  return list;
};

export const chartBreedNames = (arr) => {
  const list = arr.forEach((dog) => {
    if (dog.breed === 'West highland white terrier') dog.breed = 'Westie';
    else if (dog.breed === 'Yorkshire terrier') dog.breed = 'Yorkie';
    else if (dog.breed === 'Shiba inu') dog.breed = 'Shiba';
    else if (dog.breed === 'Chow chow' || dog.breed === 'Rat terrier')
      dog.breed = dog.breed;
    else dog.breed = dog.breed.split(' ').join('\n');
  });
  return list;
};
