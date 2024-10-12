# Usar a imagem base do Nginx
FROM nginx:alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/share/nginx/html

# Remover os arquivos padrão da pasta HTML do Nginx
RUN rm -rf ./*

# Copiar seus arquivos da pasta local para o diretório de trabalho no container
COPY . /usr/share/nginx/html

# Expor a porta 80 para servir a aplicação
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
