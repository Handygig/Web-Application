# Use the official PHP 8.4 image with Apache
FROM php:8.4.27-apache

# Set working directory for Apache's web root
WORKDIR /var/www/html

# Install only the system package needed for Composer dist archives.
RUN apt-get update && apt-get install -y \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions required by the project
RUN docker-php-ext-install pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache's rewrite module for Laravel's pretty URLs
RUN a2enmod rewrite

# Configure Apache to point to Laravel's public directory
# And allow .htaccess overrides for routing
RUN echo "<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>" > /etc/apache2/sites-available/000-default.conf

# Copy composer files and install dependencies
# This is done before copying the rest of the app to leverage Docker caching
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev --no-scripts

# Copy the rest of the application files
COPY . .

# Now, generate the optimized autoloader and run scripts
RUN composer dump-autoload --optimize --no-dev

# Set correct ownership for storage and bootstrap/cache directories
RUN chown -R www-data:www-data storage bootstrap/cache

# Set correct permissions for storage and bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Expose port 80 for web access
EXPOSE 80

# Set PHP upload limits (for large file uploads, e.g., videos)
RUN echo "upload_max_filesize=200M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size=200M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_input_time=300" >> /usr/local/etc/php/conf.d/uploads.ini

# Optional: Increase Apache's limit (if needed)
RUN echo "LimitRequestBody 209715200" >> /etc/apache2/apache2.conf

CMD ["apache2-foreground"]
