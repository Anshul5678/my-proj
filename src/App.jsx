import SearchBar from "./SearchBar";
import ItemDetail from "./ItemDetail";
import {BrowserRouter as Router,Routes,Route}from "react-router-dom";

function App() {
  return (
    <Router>
    <div>
      <h1>Search Bar</h1>
     <Routes>
        <Route path="/" element={<SearchBar/>}/>
        <Route path="/item-details" element={<ItemDetail/>}/> 
     </Routes>
    </div>
    </Router>
  );
}

export default App;