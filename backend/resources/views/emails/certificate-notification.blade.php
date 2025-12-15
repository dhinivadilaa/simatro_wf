<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sertifikat Siap Diunduh</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px 20px; background: #f8f9fa; }
        .certificate-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; background: #e9ecef; }
        .icon { font-size: 48px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">🎓</div>
            <h1>Sertifikat Anda Siap!</h1>
        </div>
        
        <div class="content">
            <p>Halo <strong>{{ $participantName }}</strong>,</p>
            
            <p>Selamat! Sertifikat Anda untuk acara <strong>{{ $eventName }}</strong> telah siap dan dapat diunduh.</p>
            
            <div class="certificate-info">
                <h3>📋 Detail Sertifikat</h3>
                <p><strong>Nomor Sertifikat:</strong> {{ $certificateNumber }}</p>
                <p><strong>Acara:</strong> {{ $eventName }}</p>
                <p><strong>Penerima:</strong> {{ $participantName }}</p>
                <p><strong>Status:</strong> <span style="color: #28a745;">✅ Siap Diunduh</span></p>
            </div>
            
            <p>Silakan login ke sistem SIMATRO untuk mengunduh sertifikat Anda.</p>
            
            <div style="text-align: center;">
                <a href="http://localhost:5173" class="button">🔗 Buka SIMATRO</a>
            </div>
            
            <p style="margin-top: 30px;">Terima kasih atas partisipasi Anda dalam acara ini!</p>
        </div>
        
        <div class="footer">
            <p>📧 Email ini dikirim secara otomatis oleh sistem SIMATRO</p>
            <p>Jangan balas email ini. Untuk bantuan, hubungi admin.</p>
        </div>
    </div>
</body>
</html>