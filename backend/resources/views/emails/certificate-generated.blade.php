<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sertifikat Tersedia</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
        .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Sertifikat Anda Telah Tersedia!</h1>
        </div>
        
        <div class="content">
            <p>Halo <strong>{{ $participantName }}</strong>,</p>
            
            <p>Selamat! Sertifikat untuk acara <strong>{{ $eventName }}</strong> telah berhasil dibuat dan siap untuk diunduh.</p>
            
            <p><strong>Detail Sertifikat:</strong></p>
            <ul>
                <li>Nomor Sertifikat: {{ $certificateNumber }}</li>
                <li>Acara: {{ $eventName }}</li>
                <li>Penerima: {{ $participantName }}</li>
            </ul>
            
            <p>Silakan kunjungi website SIMATRO untuk mengunduh sertifikat Anda.</p>
            
            <div style="text-align: center;">
                <a href="http://localhost:5173" class="button">🔗 Buka SIMATRO</a>
            </div>
            
            <p>Terima kasih atas partisipasi Anda!</p>
        </div>
        
        <div class="footer">
            <p>Email ini dikirim secara otomatis oleh sistem SIMATRO.</p>
        </div>
    </div>
</body>
</html>