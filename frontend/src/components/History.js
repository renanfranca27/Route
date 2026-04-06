import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/history', {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setHistory(res.data);
      } catch (err) {
        console.error('Erro ao buscar histórico', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(route => {
    if (filter === 'all') return true;
    return route.status === filter;
  });

  const exportToCSV = () => {
    const headers = ['Data', 'Origem', 'Destino', 'Distância (km)', 'Custo (R$)', 'Status'];
    const rows = filteredHistory.map(route => [
      new Date(route.date).toLocaleDateString('pt-BR'),
      route.origin,
      route.destination,
      route.distance,
      route.cost?.toFixed(2) || '0',
      route.status
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'historico_rotas.csv';
    link.click();
  };

  return (
    <div className="history">
      <div className="form-section">
        <h2>Histórico de Rotas</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todas</option>
            <option value="em andamento">Em Andamento</option>
            <option value="concluído">Concluído</option>
          </select>
          <button 
            onClick={exportToCSV}
            style={{
              padding: '8px 16px',
              background: '#1a7346',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            📥 Exportar CSV
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#999' }}>Carregando...</p>
        ) : filteredHistory.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>Nenhuma rota no histórico</p>
        ) : (
          <table className="history">
            <thead>
              <tr>
                <th>Data</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Distância</th>
                <th>Custo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(route => (
                <tr key={route._id}>
                  <td>{new Date(route.date).toLocaleDateString('pt-BR')}</td>
                  <td>{route.origin}</td>
                  <td>{route.destination}</td>
                  <td>{route.distance} km</td>
                  <td>R$ {route.cost?.toFixed(2) || '0'}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: route.status === 'concluído' ? '#e8f5e9' : '#fff3cd',
                      color: route.status === 'concluído' ? '#1a7346' : '#856404'
                    }}>
                      {route.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default History;