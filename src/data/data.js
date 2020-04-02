import { db } from '../../config/firebase';


export const dogsData = 
db.collectionGroup('dogs').onSnapshot(
   snapshot => {
      const allDogsArr = [];
      snapshot.forEach(doc => {
         const { breed, imageUrl, location, points } = doc.data();
         allDogsArr.push({
            key: doc.id,
            breed,
            imageUrl,
            location,
            points
         });
         // console.log('hello', doc.id, ' => ', doc.data());
      });
      // setLoading(false);
      return allDogsArr
    //   setAllDogs(allDogsArr);
   }
   //  err => {
   //     setError(err);
   //  }
);

export const data = [
   { quarter: 1, earnings: 13000 },
   { quarter: 2, earnings: 16500 },
   { quarter: 3, earnings: 14250 },
   { quarter: 4, earnings: 19000 }
];