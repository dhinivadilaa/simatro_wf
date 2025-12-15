# Konfigurasi SMTP untuk Email Otomatis

## Setup Gmail SMTP

1. **Buat App Password di Gmail:**
   - Login ke Gmail
   - Pergi ke Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate app password untuk aplikasi

2. **Update .env file:**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-digit-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="SIMATRO System"
```

## Alternatif SMTP Providers

### Mailtrap (Development)
```env
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
```

### SendGrid
```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
```

### Mailgun
```env
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your-mailgun-username
MAIL_PASSWORD=your-mailgun-password
```

## Testing Email

Jalankan command berikut untuk test email:
```bash
php artisan tinker
Mail::raw('Test email', function($message) {
    $message->to('test@example.com')->subject('Test');
});
```

## Fitur Email Otomatis

- ✅ Email dikirim otomatis saat admin generate sertifikat
- ✅ Template email yang menarik dengan informasi lengkap
- ✅ Error handling jika email gagal dikirim
- ✅ Log error untuk debugging
- ✅ Support untuk generate individual dan bulk

## API Endpoints

- `POST /api/events/{eventId}/certificates/generate-all` - Generate semua sertifikat + kirim email
- `POST /api/participants/{participantId}/certificate/generate` - Generate sertifikat individual + kirim email