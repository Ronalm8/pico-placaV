import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CitySelector from './CitySelector';
import Clock from './Clock';
import AdminPanel from './AdminPanel';
import '../styles/App.css';
import ThemeToggle from './ThemeToggle';
import { useGetRestrictions } from '../hooks/restrictionsQueries';
import useThemeStore from '../stores/themeStore';
import { useUserRestriction } from '../hooks/useUserRestriction';

function UserView() {
  const { data: restrictions, isLoading, error } = useGetRestrictions();
  const [selectedCity, setSelectedCity] = useState('');
  const { currentRestriction, restrictionActive, timeInfo } = useUserRestriction(restrictions, selectedCity);

  if (isLoading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error.message || 'Error al cargar datos'}</div>;
  if (!restrictions) return <div>No hay datos disponibles</div>;

  return (
    <div className="container-user">
      <Clock />
      <CitySelector
        cities={Object.keys(restrictions)}
        selectedCity={selectedCity}
        onChangeCity={setSelectedCity}
        loading={isLoading}
      />
      {selectedCity && currentRestriction && (
        <div className="info-card">
          <div className="date">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </div>
          <div className="restriction">
            Placas restringidas hoy:
            <div className="plates">
              {restrictionActive && currentRestriction.plates
                ? <span>{currentRestriction.plates}</span>
                : <span style={{ color: '#888' }}>Sin restricción en este momento</span>
              }
            </div>
          </div>
          <div className={`status ${restrictionActive && currentRestriction.plates ? 'active' : 'inactive'}`}>
            {restrictionActive && currentRestriction.plates
              ? '🚫 Restricción ACTIVA'
              : '✅ Sin restricción en este momento'}
          </div>
          {restrictionActive && currentRestriction.plates && (
            <div className="time-info">
              <div className="time-detail">
                <span>Tiempo transcurrido:</span>
                <strong>{timeInfo.elapsedTime}</strong>
              </div>
              <div className="time-detail">
                <span>Tiempo restante:</span>
                <strong>{timeInfo.remainingTime}</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <Router>
      <div className={`app ${isDarkMode ? 'dark' : ''}`}>
        <ThemeToggle />
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/admin">Administrador</Link></li>
          </ul>
        </nav>
        <main className="container">
          <Routes>
            <Route path="/" element={<UserView />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
