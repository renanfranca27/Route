import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader } from '@googlemaps/js-api-loader';

const Dashboard = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicle, setVehicle] = useState('Caminhão3/4 (6,5km/l)');
  const [fuelPrice, setFuelPrice] = useState(6.10);
  const [priority, setPriority] = useState('Equilibrada (tempo + custo)');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);

  // Parse consumo do veículo
  const getFuelConsumption = (vehicleStr) => {
    const match = vehicleStr.match(/(\d+[.,]\d+)/);
    return match ? parseFloat(match[0].replace(',', '.')) : 10;
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['geometry']
    });
    loader.load().then(() => {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        const mapInstance = new window.google.maps.Map(mapContainer, {
          center: { lat: -23.5505, lng: -46.6333 },
          zoom: 8,
        });
        setMap(mapInstance);
      }
    }).catch((err) => {
      setError('Falha ao carregar Google Maps. Verifique a chave da API.');
      console.error('Google Maps load error', err);
    });
  }, []);

  const calculateRoutes = async () => {
    if (!origin || !destination) {
      setError('Preencha origem e destino');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Enviando requisição para:', origin, 'até', destination);
      const fuelCons = getFuelConsumption(vehicle);
      
      const res = await axios.post('http://localhost:5000/api/routes', {
        origin,
        destination,
        waypoints: [],
        avoidTolls: false,
        avoidHighways: false,
      }, {
        timeout: 10000
      });

      console.log('Rotas recebidas:', res.data);

      if (!res.data || res.data.length === 0) {
        setError('Nenhuma rota encontrada. Tente uma origem/destino diferente.');
        setLoading(false);
        return;
      }

      const processedRoutes = res.data.map((route, idx) => ({
        ...route,
        id: idx,
        cost: (route.distance / fuelCons) * fuelPrice,
        tollCost: Math.random() * 50,
        recommended: idx === 0,
      }));

      setRoutes(processedRoutes);
      if (processedRoutes.length > 0) {
        setSelectedRoute(processedRoutes[0]);
      }
      displayRoutes(processedRoutes);
    } catch (err) {
      console.error('Erro completo:', err);
      if (err.code === 'ECONNREFUSED') {
        setError('❌ Não consegui conectar ao backend (porta 5000). Verifique se está rodando: npm start na pasta backend');
      } else if (err.code === 'ENOTFOUND') {
        setError('❌ Servidor não encontrado. Verifique o endereço do backend.');
      } else if (err.response) {
        setError(`Erro do servidor: ${err.response.status} - ${err.response.data?.message || 'Desconhecido'}`);
      } else {
        setError(`Erro ao calcular rotas: ${err.message}`);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const displayRoutes = (routes) => {
    if (!map || !window.google) return;
    
    // Limpar polilinhas antigas
    if (map.polylines) {
      map.polylines.forEach(line => line.setMap(null));
    }
    map.polylines = [];

    routes.forEach((route, index) => {
      try {
        if (route.polyline) {
          const path = window.google.maps.geometry.encoding.decodePath(route.polyline);
          const polyline = new window.google.maps.Polyline({
            path,
            strokeColor: route.recommended ? '#1a7346' : '#999999',
            strokeOpacity: 0.8,
            strokeWeight: route.recommended ? 3 : 2,
            map,
          });
          map.polylines.push(polyline);
        }
      } catch (e) {
        console.error('Error displaying polyline', e);
      }
    });
  };

  const saveRoute = async (route) => {
    try {
      await axios.post('/api/history', {
        origin,
        destination,
        distance: route.distance,
        duration: route.duration,
        cost: route.cost,
        cities: route.cities || [],
        status: 'em andamento'
      }, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      alert('Rota salva com sucesso!');
    } catch (err) {
      alert('Erro ao salvar rota');
    }
  };

  return (
    <div className="dashboard">
      {error && (
        <div className="alert-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="alert-banner">
        <span>🚀 Modo demonstração ativo – rotas são simuladas.</span>
        <a href="#settings">Configurar API Google Maps →</a>
      </div>

      <div className="form-section">
        <h2>Comparar rotas</h2>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
          Veja as melhores rotas, as cidades por onde passa e escolha a melhor
        </p>

        <div className="form-grid">
          <div className="form-group">
            <label>CIDADE DE ORIGEM</label>
            <input
              type="text"
              placeholder="Ex: São Paulo"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>CIDADE DE DESTINO</label>
            <input
              type="text"
              placeholder="Ex: Rio de Janeiro"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>VEÍCULO</label>
            <select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
              <option>Caminhão3/4 (6,5km/l)</option>
              <option>Moto (20km/l)</option>
              <option>Carro (12km/l)</option>
              <option>Van (8km/l)</option>
            </select>
          </div>

          <div className="form-group">
            <label>PREÇO COMBUSTÍVEL (R$/L)</label>
            <input
              type="number"
              step="0.01"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(parseFloat(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>PRIORIDADE DA ROTA</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Mais rápida</option>
              <option>Mais barata</option>
              <option>Equilibrada (tempo + custo)</option>
            </select>
          </div>
        </div>

        <button 
          className="calculate-button" 
          onClick={calculateRoutes}
          disabled={loading}
        >
          {loading ? '⏳ Calculando...' : '🔍 Calcular e comparar rotas'}
        </button>
      </div>

      <div id="map" style={{ height: '400px', width: '100%', borderRadius: '8px', marginBottom: '30px', display: 'none' }}></div>

      {routes.length > 0 && (
        <div className="routes-section">
          <h3 className="routes-header">
            {routes.length} rotas encontradas de {origin} para {destination}
          </h3>

          <div className="routes-container">
            {routes.map((route, idx) => (
              <div 
                key={route.id} 
                className={`route ${selectedRoute?.id === route.id ? 'selected' : ''} ${route.recommended ? 'recommended' : ''}`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="route-header">
                  {route.recommended ? (
                    <span className="route-badge">✓ Recomendada</span>
                  ) : (
                    <span className="route-badge alternative">Alternativa {idx}</span>
                  )}
                  <div>
                    <div className="route-title">Via BR-{101 + idx}</div>
                    <div className="route-subtitle">Passada por: {route.cities?.[0] || 'Cidades'}</div>
                  </div>
                </div>

                <div className="route-stats">
                  <div className="stat">
                    <span className="stat-label">Distância</span>
                    <span className="stat-value">{route.distance?.toFixed(0) || 150} km</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Tempo estimado</span>
                    <span className="stat-value">{route.duration?.toFixed(0) || 180} min</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Custo combustível</span>
                    <span className="stat-value">R$ {route.cost?.toFixed(2) || '120'}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Pedágio</span>
                    <span className="stat-value">R$ {route.tollCost?.toFixed(2) || '0'}</span>
                  </div>
                </div>

                <div className="route-cities">
                  <div className="cities-label">CIDADES NO PERCURSO</div>
                  <div className="cities-list">
                    <span className="city-badge start">📍 {origin}</span>
                    <span style={{ color: '#999' }}>→</span>
                    <span className="city-badge">Campinas Grande</span>
                    <span style={{ color: '#999' }}>→</span>
                    <span className="city-badge">São Paulo</span>
                    <span style={{ color: '#999' }}>→</span>
                    <span className="city-badge">Rio de Janeiro</span>
                    <span style={{ color: '#999' }}>→</span>
                    <span className="city-badge end">📍 {destination}</span>
                  </div>
                </div>

                <div className="route-actions">
                  <button 
                    className="route-button"
                    onClick={() => setSelectedRoute(route)}
                  >
                    Ver opção
                  </button>
                  <button 
                    className="route-button primary"
                    onClick={() => saveRoute(route)}
                  >
                    Selecionar esta rota
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;