#!/bin/bash
# Script para testar a autenticação

echo "===== Teste de Autenticação RouteLog ====="

# Health check
echo ""
echo "1. Verificando health check do backend..."
curl -X GET http://localhost:5000/api/health
echo ""

# Teste de Registro
echo ""
echo "2. Testando registro de novo usuário..."
REGISTER_RESPONSE=$(curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@routelog.com","password":"senha123"}')
echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token obtido: $TOKEN"

# Teste de Login
echo ""
echo "3. Testando login com mesmas credenciais..."
LOGIN_RESPONSE=$(curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@routelog.com","password":"senha123"}')
echo "Response: $LOGIN_RESPONSE"

# Teste de Histórico (requer autenticação)
echo ""
echo "4. Testando acesso ao histórico com token..."
if [ -n "$TOKEN" ]; then
  curl -X GET http://localhost:5000/api/history \
    -H "Authorization: $TOKEN"
  echo ""
else
  echo "Token não obtido, pulando teste de histórico"
fi

echo ""
echo "===== Testes Concluídos ====="
