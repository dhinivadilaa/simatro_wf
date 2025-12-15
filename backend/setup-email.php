<?php

echo "🔧 SIMATRO Email Setup\n";
echo "====================\n\n";

echo "Pilih provider email:\n";
echo "1. Gmail (butuh App Password)\n";
echo "2. Mailtrap (recommended untuk development)\n";
echo "3. Log only (untuk testing)\n\n";

$choice = readline("Pilihan (1-3): ");

$envFile = __DIR__ . '/.env';
$envContent = file_get_contents($envFile);

switch($choice) {
    case '1':
        echo "\n📧 Setup Gmail:\n";
        $email = readline("Email Gmail: ");
        $password = readline("App Password (16 digit): ");
        
        $envContent = preg_replace('/MAIL_MAILER=.*/', 'MAIL_MAILER=smtp', $envContent);
        $envContent = preg_replace('/MAIL_HOST=.*/', 'MAIL_HOST=smtp.gmail.com', $envContent);
        $envContent = preg_replace('/MAIL_PORT=.*/', 'MAIL_PORT=587', $envContent);
        $envContent = preg_replace('/MAIL_USERNAME=.*/', "MAIL_USERNAME={$email}", $envContent);
        $envContent = preg_replace('/MAIL_PASSWORD=.*/', "MAIL_PASSWORD={$password}", $envContent);
        $envContent = preg_replace('/MAIL_ENCRYPTION=.*/', 'MAIL_ENCRYPTION=tls', $envContent);
        $envContent = preg_replace('/MAIL_FROM_ADDRESS=.*/', "MAIL_FROM_ADDRESS=\"{$email}\"", $envContent);
        break;
        
    case '2':
        echo "\n📧 Setup Mailtrap:\n";
        $username = readline("Mailtrap Username: ");
        $password = readline("Mailtrap Password: ");
        
        $envContent = preg_replace('/MAIL_MAILER=.*/', 'MAIL_MAILER=smtp', $envContent);
        $envContent = preg_replace('/MAIL_HOST=.*/', 'MAIL_HOST=sandbox.smtp.mailtrap.io', $envContent);
        $envContent = preg_replace('/MAIL_PORT=.*/', 'MAIL_PORT=2525', $envContent);
        $envContent = preg_replace('/MAIL_USERNAME=.*/', "MAIL_USERNAME={$username}", $envContent);
        $envContent = preg_replace('/MAIL_PASSWORD=.*/', "MAIL_PASSWORD={$password}", $envContent);
        $envContent = preg_replace('/MAIL_ENCRYPTION=.*/', 'MAIL_ENCRYPTION=tls', $envContent);
        $envContent = preg_replace('/MAIL_FROM_ADDRESS=.*/', 'MAIL_FROM_ADDRESS="noreply@simatro.com"', $envContent);
        break;
        
    case '3':
    default:
        echo "\n📝 Setup Log Mode:\n";
        $envContent = preg_replace('/MAIL_MAILER=.*/', 'MAIL_MAILER=log', $envContent);
        $envContent = preg_replace('/MAIL_FROM_ADDRESS=.*/', 'MAIL_FROM_ADDRESS="noreply@simatro.com"', $envContent);
        break;
}

file_put_contents($envFile, $envContent);
echo "\n✅ Konfigurasi email berhasil diupdate!\n";
echo "🧪 Test dengan: php artisan email:test your-email@example.com\n";