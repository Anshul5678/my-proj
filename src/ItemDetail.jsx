import{useLocation} from 'react-router-dom';

const ItemDetail =()=>{
    const location = useLocation();
    const{value, timestamp}=location.state ||{};

  return (
    <div>
        <hi>Item Details</hi>
        <p><strong>List Name</strong>{value}</p>
        <p><strong>Date and Time</strong>{timestamp}</p>
    </div>
  )
}



  

export default ItemDetail;