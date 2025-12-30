# Hostinger Deployment Instructions

Since you are already logged into the server at `domains/jkecc.com/public_html`, copy and run these commands block by block.

## 1. Setup Git & Pull Code
```bash
# Initialize git in the current folder (if not done)
git init

# Add your repository
git remote add origin https://github.com/BilalTali/tradeunion.git

# Pull the latest code (force overwrites default files)
git fetch origin
git reset --hard origin/main
```

## 2. Install Dependencies
```bash
# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install Node dependencies and build assets
npm install
npm run build
```

## 3. Configuration & Database
```bash
# Create environment file
cp .env.example .env

# Generate Key
php artisan key:generate

# Link Storage
php artisan storage:link
```

> [!IMPORTANT]
> **Edit your .env file now!**
> Run `nano .env` and update:
> 1. `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
> 2. `APP_URL=https://jkecc.com`
> 3. `APP_ENV=production`
> 4. `APP_DEBUG=false`

## 4. Finalize
```bash
# Run migrations (after editing .env)
php artisan migrate --force

# Optimize cache
php artisan optimize
```

## 5. Pointing Domain to /public
Hostinger serves from `public_html` by default, but Laravel serves from `public`.
Create a `.htaccess` file in `public_html` to redirect traffic:

Run `nano .htaccess` and paste this:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```
