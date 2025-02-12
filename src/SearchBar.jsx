import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMUKkzDt1JKYBmVOY7gAP5e5Ihi5km2JE",
  authDomain: "searchbar-project-6fb15.firebaseapp.com",
  projectId: "searchbar-project-6fb15",
  storageBucket: "searchbar-project-6fb15.appspot.com",
  messagingSenderId: "677541949987",
  appId: "1:677541949987:web:7097631efece063c65f796",
  measurementId: "G-NMH7KSY1K6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = collection(db, "items");
    const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
      const itemsArray = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        itemsArray.push({
          id: doc.id,
          value: data.value,
          timestamp: data.timestamp?.toDate().toLocaleString(), 
        });
      });
      setItems(itemsArray);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      try {
        const itemsRef = collection(db, "items");
        const timestamp = new Date();
        await addDoc(itemsRef, { value: inputValue, timestamp }); 
        console.log("Data submitted to Firestore:", inputValue);
        setInputValue("");
      } catch (error) {
        console.error("Error submitting to Firestore:", error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type something..."
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.value}  <small>{item.timestamp}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;