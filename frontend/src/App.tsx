import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
// import history from './history';
import { Provider } from './components/ui/provider';
import Signin from './pages/Signin';
import Home from './pages/Home';
import AddBudgetGoals from './pages/AddBudgetGoals'

const history = createMemoryHistory();
function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/BudgetGoals" element={<AddBudgetGoals/>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
