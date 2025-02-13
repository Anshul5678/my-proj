import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
  const [editingId, setEditingId] = useState(null); 
  const [editedValue, setEditedValue] = useState("");
  const navigate = useNavigate(); 

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await getDocs(collection(db, "items"));
        const data = [];
        docs.forEach((doc) => {
          const docData = doc.data();
      
          const timestamp = docData.timestamp
            ? docData.timestamp.toDate().toLocaleString()
            : '';
          data.push({ 
            id: doc.id, 
            ...docData,
            timestamp 
          });
        });
        setItems(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
     
      try {
        const itemsRef = collection(db, "items");
        const docRef = await addDoc(itemsRef, {
          value: inputValue,
          timestamp: new Date(), 
        });

        
        const newItem = {
          id: docRef.id, 
          value: inputValue,
          timestamp: new Date().toLocaleString(), 
        };

        setItems((prevItems) => [...prevItems, newItem]);
        console.log("Data submitted to Firestore:", inputValue);
      } catch (error) {
        console.error("Error submitting to Firestore:", error);
      }

     
      setInputValue("");
    }
  };

  
  const handleEdit = (id, currentValue) => {
    setEditingId(id); 
    setEditedValue(currentValue);
  };

 
  const handleSaveEdit = async (id) => {
    try {
     
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, value: editedValue } : item
        )
      );

      
      const itemRef = doc(db, "items", id);
      await updateDoc(itemRef, {
        value: editedValue,
      });

      console.log("Item updated in Firestore:", editedValue);
      setEditingId(null); 
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  
  const handleDelete = async (id) => {
    try {
     
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));

     
      const itemRef = doc(db, "items", id);
      await deleteDoc(itemRef);

      console.log("Item deleted from Firestore:", id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
console.log(items)
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something..."
        />
        <button type="submit">Submit</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>List Name</th>
            <th>Date and Time</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              {/* <td onClick ={()=> navigate("/item-details",{state:item})}>{item.value}</td> */}
              <td  onClick ={()=> navigate("/item-details",{state:item})}>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editedValue}
                    onChange={(e) => {
                      e.stopPropagation();
                      setEditedValue(e.target.value)}}
                      onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  item.value
                )}
              </td>
              <td>{item.timestamp}</td>
              <td>
                {editingId === item.id ? (
                  <button onClick={() => handleSaveEdit(item.id)}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(item.id, item.value)}>
                    Edit
                  </button>
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchBar;
