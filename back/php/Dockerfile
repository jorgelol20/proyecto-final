FROM php:8.3-fpm-alpine

# Dependencias del sistema (zip, intl, etc.) + herramientas
RUN apk add --no-cache \
    bash \
    git \
    unzip \
    icu-dev \
    oniguruma-dev \
    libzip-dev \
    mysql-client \
  && docker-php-ext-configure intl \
  && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_mysql \
    mbstring \
    intl \
    zip \
  && rm -rf /var/cache/apk/*

# Composer (copiado desde la imagen oficial)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY uploads.ini /usr/local/etc/php/conf.d/uploads.ini

# Entrypoint para corregir permisos de Laravel en runtime (bind mounts)
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /var/www

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["php-fpm"]
