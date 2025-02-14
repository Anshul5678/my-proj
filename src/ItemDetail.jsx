import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

const ItemDetail = () => {
  const location = useLocation();
  const { value, timestamp, id } = location.state || {};
  const [updates, setUpdates] = useState([]);

  
  useEffect(() => {
    const fetchUpdates = async () => {
      if (id) {
        try {
          const updatesRef = collection(db, "items", id, "updates");
          const updatesData = [];

          const updatesCollection = await getDocs(updatesRef);
          updatesCollection.forEach((doc) => {
            updatesData.push(doc.data());
          });

          setUpdates(updatesData);
        } catch (error) {
          console.error("Error fetching updates: ", error);
        }
      }
    };

    fetchUpdates();
  }, [id]);

  return (
    <div>
      <h1>Item Details</h1>
      <p><strong>List Name:</strong> {value}</p>
      <p><strong>Date and Time:</strong> {timestamp}</p>

      <div>
        <h1>History</h1>
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Old Name</th>
              <th>Updated Name</th>
              <th>Updated Time</th>
            </tr>
          </thead>
          <tbody>
            {updates.map((update, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{update.oldName}</td>
                <td>{update.updatedName}</td>
                <td>{update.updatedTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemDetail;