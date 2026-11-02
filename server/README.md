Hostel Pulse - PHP API skeleton

Quick start:

1. cd server
2. composer install
3. Copy .env.example to .env and edit DB / SUPABASE settings
4. Create the database and run migrations (see `database/README.md`)
5. Start the dev server: php -S localhost:8000 -t public

Available endpoints:
- GET /api/v1/health   (public)
- GET /api/v1/me       (requires Authorization: Bearer <token>; supports mock token 'mock-token' when SUPABASE_MOCK=true)

Notes:
- This is a minimal skeleton. Implement robust JWKS-to-PEM conversion and token verification before using in production.
- Use vlucas/phpdotenv to manage envs and firebase/php-jwt for JWT handling.
