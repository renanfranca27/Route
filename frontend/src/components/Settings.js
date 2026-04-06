import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [avoidHighways, setAvoidHighways] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('googleMapsApiKey');
    const savedTolls = localStorage.getItem('avoidTolls');
    const savedHighways = localStorage.getItem('avoidHighways');

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedTolls) setAvoidTolls(JSON.parse(savedTolls));
    if (savedHighways) setAvoidHighways(JSON.parse(savedHighways));
  }, []);

  const saveSettings = () => {
    localStorage.setItem('googleMapsApiKey', apiKey);
    localStorage.setItem('avoidTolls', avoidTolls);
    localStorage.setItem('avoidHighways', avoidHighways);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings">
      <div className="settings-section">
        <h3>Configurações da API Google Maps</h3>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
          Configure sua chave da API do Google Maps para usar o modo normal (não simulado)
        </p>
        <div className="form-group">
          <label htmlFor="apiKey">Chave da API Google Maps</label>
          <input
            id="apiKey"
            type="password"
            placeholder="Colar chave da API aqui"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
            Obtenha sua chave em: https://console.cloud.google.com
          </p>
        </div>
      </div>

      <div className="settings-section">
        <h3>Preferências de Rota</h3>
        
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="avoidTolls"
            checked={avoidTolls}
            onChange={(e) => setAvoidTolls(e.target.checked)}
          />
          <label htmlFor="avoidTolls">Evitar pedágios</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="avoidHighways"
            checked={avoidHighways}
            onChange={(e) => setAvoidHighways(e.target.checked)}
          />
          <label htmlFor="avoidHighways">Evitar estradas de terra</label>
        </div>
      </div>

      <button
        onClick={saveSettings}
        style={{
          width: '100%',
          padding: '12px',
          background: '#1a7346',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        💾 Salvar Configurações
      </button>

      {saved && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#e8f5e9',
          color: '#1a7346',
          borderRadius: '4px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          ✓ Configurações salvas com sucesso!
        </div>
      )}
    </div>
  );
};

export default Settings;