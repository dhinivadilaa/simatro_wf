<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // FRONTEND kamu (Vite) pakai port 5173 atau 5174
    'allowed_origins' => ['http://localhost:5173', 'http://localhost:5174'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // WAJIB TRUE untuk Sanctum / cookie session
    'supports_credentials' => true,

];
