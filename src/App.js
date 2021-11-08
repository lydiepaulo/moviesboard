import './style/SCSS/App.scss';
import Home from './views/Home';
import Add from './views/Add';
import Edit from './views/Edit';
import Error from './views/Error';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit" element={<Edit />} />
          <Route component={Error} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
