import './style/SCSS/App.scss';
import Home from './views/Home/Home';
import Add from './views/Add/Add';
import Edit from './views/Edit';
import Details from './views/Details/Details';
import Error from './views/Error';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/movies/:id" element={<Details />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route component={Error} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
