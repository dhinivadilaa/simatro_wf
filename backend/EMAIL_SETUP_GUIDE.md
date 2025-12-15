# 🔧 Setup Email SMTP - Panduan Lengkap

## ❌ Error yang Anda alami:
Gmail menolak autentikasi karena konfigurasi keamanan.

## ✅ Solusi 1: Setup Gmail dengan App Password

### Langkah 1: Aktifkan 2-Factor Authentication
1. Buka [Google Account](https://myaccount.google.com/)
2. Security → 2-Step Verification → Aktifkan

### Langkah 2: Buat App Password
1. Security → 2-Step Verification → App passwords
2. Select app: "Mail"
3. Select device: "Other" → ketik "SIMATRO"
4. Copy 16-digit password yang dihasilkan

### Langkah 3: Update .env
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=email-anda@gmail.com
MAIL_PASSWORD=abcd-efgh-ijkl-mnop
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="email-anda@gmail.com"
MAIL_FROM_NAME="SIMATRO System"
```

## ✅ Solusi 2: Gunakan Mailtrap (Recommended untuk Development)

### Daftar di Mailtrap.io (GRATIS)
1. Buka [mailtrap.io](https://mailtrap.io)
2. Daftar akun gratis
3. Buat inbox baru
4. Copy kredensial SMTP

### Update .env untuk Mailtrap:
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@simatro.com"
MAIL_FROM_NAME="SIMATRO System"
```

## ✅ Solusi 3: Gunakan SMTP Lokal (Untuk Testing)

Update .env:
```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@simatro.com"
MAIL_FROM_NAME="SIMATRO System"
```

Email akan disimpan di `storage/logs/laravel.log`