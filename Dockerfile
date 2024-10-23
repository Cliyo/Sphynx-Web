# Usar a imagem base do Nginx
FROM nginx:alpine

RUN apk add --no-cache avahi dbus avahi-tools

RUN mkdir -p /var/run/dbus && \
    mkdir -p /var/run/avahi-daemon

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copiar seus arquivos da pasta local para o diretório de trabalho no container
COPY . /usr/share/nginx/html
COPY ./docker-config/nginx.conf /etc/nginx/nginx.conf
COPY ./docker-config/avahi-daemon.conf /etc/avahi/avahi-daemon.conf

RUN rm -rf /etc/avahi/services/*

EXPOSE 80 5353/udp

COPY ./docker-config/start.sh /start.sh
RUN chmod +x /start.sh

#iniciar o container
CMD ["/start.sh"]
