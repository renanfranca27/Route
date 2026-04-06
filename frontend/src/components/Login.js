import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/register', { email, password });
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <h2>🚗 RouteLog</h2>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '30px', fontSize: '14px' }}>
          Comparador de rotas inteligente
        </p>

        {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          <div className="login-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Carregando...' : isRegister ? 'Registrar' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          {isRegister ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={{ color: '#1a7346', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isRegister ? 'Entrar' : 'Registrar'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;