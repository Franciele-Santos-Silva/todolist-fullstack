# Esperar 15 segundos para os containers subirem
echo "Aguardando containers subirem..."
sleep 15

# Verificar backend
echo "Testando backend..."
HTTP_CODE_BACKEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/tasks)
if [ "$HTTP_CODE_BACKEND" -ne 200 ]; then
  echo "Erro: backend não respondeu corretamente. Status code: $HTTP_CODE_BACKEND"
  exit 1
fi
echo "Backend OK."

# Verificar banco de dados (MySQL/PostgreSQL) via container
echo "Verificando banco de dados..."
DB_CONTAINER=$(docker ps --filter "name=db" --format "{{.Names}}")
if [ -z "$DB_CONTAINER" ]; then
  echo "Erro: container do banco não está rodando."
  exit 1
fi
echo "Banco de dados OK. Container: $DB_CONTAINER"

# Verificar frontend
echo "Testando frontend..."
HTTP_CODE_FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
if [ "$HTTP_CODE_FRONTEND" -ne 200 ]; then
  echo "Erro: frontend não respondeu corretamente. Status code: $HTTP_CODE_FRONTEND"
  exit 1
fi
echo "Frontend OK."

echo "Todos os testes passaram!"
exit 0