# 📧 Admin Email & Preview API Documentation

## 🔍 **Preview Template Sertifikat**

### GET `/api/certificate-templates/{templateId}/preview`
Preview template sertifikat sebelum generate

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "template_name": "Template Webinar",
    "event_name": "Webinar AI 2024",
    "file_url": "http://localhost/storage/certificate-templates/template.jpg",
    "file_path": "certificate-templates/template.jpg"
  }
}
```

## 📋 **Lihat Sertifikat yang Sudah Dibuat**

### GET `/api/events/{eventId}/certificates`
Menampilkan sertifikat yang sudah di-generate (bukan semua sertifikat)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "certificate_number": "CERT-2024-001",
      "participant_name": "John Doe",
      "participant_email": "john@example.com",
      "event_title": "Webinar AI 2024",
      "preview_url": "http://localhost/storage/certificates/cert-001.jpg",
      "file_exists": true,
      "has_email": true
    }
  ]
}
```

## 📧 **Kirim Email Sertifikat**

### POST `/api/certificates/{certificateId}/send-email-admin`
Kirim email sertifikat ke peserta (tombol terpisah di admin)

**Response Success:**
```json
{
  "success": true,
  "message": "Email sertifikat berhasil dikirim ke john@example.com"
}
```

**Response Error:**
```json
{
  "success": false,
  "message": "Email peserta tidak ditemukan"
}
```

## 📤 **Kirim Email Massal**

### POST `/api/events/{eventId}/certificates/send-bulk-email`
Kirim email ke semua peserta yang memiliki sertifikat

**Response:**
```json
{
  "success": true,
  "message": "Email berhasil dikirim ke 15 peserta dari 20 total",
  "details": {
    "total": 20,
    "success": 15,
    "failed": 5
  }
}
```

## 🎯 **Generate + Email Otomatis**

### POST `/api/events/{eventId}/certificates/generate-all`
Generate sertifikat dan kirim email otomatis

**Response:**
```json
{
  "success": true,
  "message": "Berhasil membuat 10 sertifikat",
  "generated_count": 10
}
```

## 📁 **File Storage**

- **Template:** `storage/app/public/certificate-templates/`
- **Sertifikat:** `storage/app/public/certificates/`
- **URL Access:** `http://localhost/storage/...`

## 🔧 **Frontend Integration**

```javascript
// Preview template
const previewTemplate = async (templateId) => {
  const response = await fetch(`/api/certificate-templates/${templateId}/preview`);
  const data = await response.json();
  if (data.success) {
    // Tampilkan preview: data.data.file_url
  }
};

// Kirim email individual
const sendEmail = async (certificateId) => {
  const response = await fetch(`/api/certificates/${certificateId}/send-email-admin`, {
    method: 'POST'
  });
  const data = await response.json();
  alert(data.message);
};

// Lihat sertifikat yang sudah dibuat
const getCertificates = async (eventId) => {
  const response = await fetch(`/api/events/${eventId}/certificates`);
  const data = await response.json();
  // data.data berisi array sertifikat dengan preview_url
};
```