# Espera os containers subirem
echo "Aguardando containers subindo..."
sleep 10

# Verifica se os containers estão ativos
CONTAINERS_RUNNING=$(docker ps -q | wc -l)
if [ "$CONTAINERS_RUNNING" -lt 3 ]; then
  echo "Erro: nem todos os containers estão rodando."
  exit 1
else
  echo "Todos os containers estão ativos."
fi

# Testa backend
API_RESPONSE=$(curl -s http://localhost:3000/api/tasks)
if [[ $API_RESPONSE == *"["* ]]; then
  echo "Backend funcionando corretamente."
else
  echo "Erro: Backend não respondeu como esperado."
  exit 1
fi

echo "Todos os testes passaram!"