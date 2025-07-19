import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { RestrictionsProvider } from './context/RestrictionsContext';
import UserView from './components/UserView';
import AdminPanel from './components/AdminPanel';
import './styles/App.css';


function App() {
    return (
        <RestrictionsProvider>
            <Router>
                <div>
                    <nav className="main-nav">
                        
                        <ul>
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/admin">Administrador</Link></li>
                        </ul>
                    </nav>
                    
                    <Routes>
                        <Route path="/" element={<UserView />} />
                        <Route path="/admin" element={<AdminPanel />} />
                    </Routes>
                </div>
            </Router>
        </RestrictionsProvider>
    );
}

export default App;