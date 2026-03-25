FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

# Installer les extensions PHP nécessaires
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql zip gd

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copier les fichiers Laravel
COPY . .

# Installer les dépendances Laravel
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
