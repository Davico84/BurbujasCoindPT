import React, { useState } from "react";
import "./components/tailwind.css";
import BubbleChart from "./components/MyDataViz";
import GraphbyDay from "./components/GraphbyDay";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div className="w-65 bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <ul>
            <li className="mb-2">
              <a href="#" className="block p-2 hover:bg-gray-700">Option 1</a>
            </li>
            <li className="mb-2">
              <a href="#" className="block p-2 hover:bg-gray-700">Option 2</a>
            </li>
            <li className="mb-2">
              <a href="#" className="block p-2 hover:bg-gray-700">Option 3</a>
            </li>
          </ul>
        </div>

        {/* Main container */}
        <div className="flex-1 flex flex-col">
          {/* Top navigation bar */}
          <div className="bg-gray-900 text-white p-4 flex justify-between space-x-4">
            <div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded p-2"
              />
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="text-xl font-bold">Home</Link>
              <Link to="/detail" className="text-xl font-bold">Detail</Link>
              <Link to="/other" className="text-xl font-bold">Other</Link>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 p-4 bg-black text-white">
            <Routes>
              <Route path="/" element={<BubbleChart />} />
              <Route path="/graph/:id/*" element={<GraphbyDay />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
