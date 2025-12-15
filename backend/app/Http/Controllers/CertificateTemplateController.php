<?php

namespace App\Http\Controllers;

use App\Models\CertificateTemplate;
use App\Models\Certificate;
use App\Models\Participant;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class CertificateTemplateController extends Controller
{
    public function index()
    {
        return CertificateTemplate::with('event')->get();
    }

    public function preview($templateId)
    {
        try {
            $template = CertificateTemplate::with('event')->findOrFail($templateId);
            
            if (!$template->file_path || !Storage::disk('public')->exists($template->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File template tidak ditemukan'
                ], 404);
            }

            $fileUrl = Storage::disk('public')->url($template->file_path);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $template->id,
                    'template_name' => $template->template_name,
                    'event_name' => $template->event->name ?? 'Unknown Event',
                    'file_url' => $fileUrl,
                    'file_path' => $template->file_path
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required',
            'title' => 'required',
            'template_file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240'
        ]);

        $filePath = null;
        if ($request->hasFile('template_file')) {
            $filePath = $request->file('template_file')->store('certificate-templates', 'public');
        }

        $template = CertificateTemplate::create([
            'event_id' => $request->event_id,
            'template_name' => $request->title,
            'content' => 'Template file uploaded',
            'file_path' => $filePath
        ]);

        return response()->json([
            'success' => true,
            'data' => $template,
            'message' => 'Template sertifikat berhasil diupload'
        ]);
    }

    public function update(Request $request, CertificateTemplate $template)
    {
        try {
            $request->validate([
                'title' => 'required',
                'template_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240'
            ]);

            $updateData = ['template_name' => $request->title];
            
            if ($request->hasFile('template_file')) {
                // Delete old file if exists
                if ($template->file_path && Storage::disk('public')->exists($template->file_path)) {
                    Storage::disk('public')->delete($template->file_path);
                }
                
                $updateData['file_path'] = $request->file('template_file')->store('certificate-templates', 'public');
            }

            $template->update($updateData);

            return response()->json([
                'success' => true,
                'data' => $template,
                'message' => 'Template berhasil diperbarui'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(CertificateTemplate $template)
    {
        // Delete file if exists
        if ($template->file_path && \Storage::disk('public')->exists($template->file_path)) {
            \Storage::disk('public')->delete($template->file_path);
        }
        
        $template->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Template berhasil dihapus'
        ]);
    }

    public function generateCertificates(Request $request, $templateId)
    {
        $template = CertificateTemplate::findOrFail($templateId);
        $event = Event::findOrFail($template->event_id);
        
        // Get participants who attended the event
        $participants = Participant::where('event_id', $event->id)
            ->whereHas('attendances')
            ->get();
        
        if ($participants->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada peserta yang hadir untuk event ini'
            ], 400);
        }
        
        $generatedCount = 0;
        
        foreach ($participants as $participant) {
            // Check if certificate already exists
            $existingCertificate = Certificate::where('participant_id', $participant->id)
                ->where('template_id', $template->id)
                ->first();
                
            if (!$existingCertificate) {
                // Generate certificate number with better format
                $certificateNumber = 'SIMATRO-' . strtoupper(substr($event->title, 0, 3)) . '-' . 
                                   date('Y') . '-' . str_pad($participant->id, 4, '0', STR_PAD_LEFT);
                
                // Create personalized certificate file
                $personalizedPath = $this->generatePersonalizedCertificate(
                    $template->file_path,
                    $participant->name,
                    $event->title,
                    Carbon::parse($event->date)->locale('id')->isoFormat('DD MMMM YYYY'),
                    $certificateNumber
                );
                
                // Create certificate record with personalized file
                $certificate = Certificate::create([
                    'participant_id' => $participant->id,
                    'event_id' => $event->id,
                    'template_id' => $template->id,
                    'certificate_number' => $certificateNumber,
                    'file_path' => $personalizedPath
                ]);
                
                // Send email notification to participant
                $this->sendCertificateEmail($participant, $event, $certificate);
                
                $generatedCount++;
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => "Berhasil generate {$generatedCount} sertifikat untuk peserta yang hadir. Sertifikat berisi nama peserta, judul event '{$event->title}', dan tanggal " . Carbon::parse($event->date)->format('d F Y'),
            'generated_count' => $generatedCount,
            'total_participants' => $participants->count(),
            'event_info' => [
                'title' => $event->title,
                'date' => Carbon::parse($event->date)->format('d F Y'),
                'formatted_date' => Carbon::parse($event->date)->locale('id')->isoFormat('DD MMMM YYYY')
            ]
        ]);
    }

    public function getCertificates($eventId)
    {
        $certificates = Certificate::with(['participant', 'template', 'event'])
            ->where('event_id', $eventId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Add formatted data and file URL for preview
        $certificates->each(function ($certificate) {
            $certificate->participant_name = $certificate->participant->name;
            $certificate->participant_email = $certificate->participant->email;
            $certificate->event_title = $certificate->event->title;
            $certificate->event_date = Carbon::parse($certificate->event->date)->locale('id')->isoFormat('DD MMMM YYYY');
            $certificate->template_name = $certificate->template->template_name;
            $certificate->has_email = !empty($certificate->participant->email);
            
            // Add preview URL for generated certificates
            if ($certificate->file_path && Storage::disk('public')->exists($certificate->file_path)) {
                $certificate->preview_url = Storage::disk('public')->url($certificate->file_path);
                $certificate->file_exists = true;
            } else {
                $certificate->preview_url = null;
                $certificate->file_exists = false;
            }
        });
            
        return response()->json([
            'success' => true,
            'data' => $certificates
        ]);
    }



    public function downloadCertificate($certificateId)
    {
        $certificate = Certificate::with(['participant', 'event', 'template'])->findOrFail($certificateId);
        
        if (!$certificate->file_path || !Storage::disk('public')->exists($certificate->file_path)) {
            return response()->json(['error' => 'File sertifikat tidak ditemukan'], 404);
        }
        
        $filePath = Storage::disk('public')->path($certificate->file_path);
        $fileName = "Sertifikat_{$certificate->participant->name}_{$certificate->event->title}." . pathinfo($certificate->file_path, PATHINFO_EXTENSION);
        
        return response()->download($filePath, $fileName);
    }

    public function getParticipantCertificates($email)
    {
        $certificates = Certificate::with(['participant', 'event', 'template'])
            ->whereHas('participant', function($query) use ($email) {
                $query->where('email', $email);
            })
            ->orderBy('created_at', 'desc')
            ->get();
            
        $certificates->each(function ($certificate) {
            $certificate->participant_name = $certificate->participant->name;
            $certificate->event_title = $certificate->event->title;
            $certificate->event_date = Carbon::parse($certificate->event->date)->locale('id')->isoFormat('DD MMMM YYYY');
            $certificate->template_name = $certificate->template->template_name;
        });
            
        return response()->json([
            'success' => true,
            'data' => $certificates
        ]);
    }

    public function downloadCertificatePublic($certificateId)
    {
        $certificate = Certificate::with(['participant', 'event', 'template'])->findOrFail($certificateId);
        
        if (!$certificate->file_path || !Storage::disk('public')->exists($certificate->file_path)) {
            return response()->json(['error' => 'File sertifikat tidak ditemukan'], 404);
        }
        
        $filePath = Storage::disk('public')->path($certificate->file_path);
        $fileName = "Sertifikat_{$certificate->participant->name}_{$certificate->event->title}." . pathinfo($certificate->file_path, PATHINFO_EXTENSION);
        
        return response()->download($filePath, $fileName);
    }

    public function viewCertificate($certificateId)
    {
        try {
            // Validate certificate ID
            if (!$certificateId || !is_numeric($certificateId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid certificate ID provided'
                ], 400);
            }

            $certificate = Certificate::with(['participant', 'event', 'template'])->find($certificateId);
            
            if (!$certificate) {
                return response()->json([
                    'success' => false,
                    'message' => 'Certificate not found'
                ], 404);
            }
            
            $certificate->participant_name = $certificate->participant ? $certificate->participant->name : 'Unknown';
            $certificate->participant_email = $certificate->participant ? $certificate->participant->email : null;
            $certificate->event_title = $certificate->event ? $certificate->event->title : 'Unknown Event';
            $certificate->event_date = $certificate->event ? Carbon::parse($certificate->event->date)->locale('id')->isoFormat('DD MMMM YYYY') : 'Unknown Date';
            $certificate->template_name = $certificate->template ? $certificate->template->template_name : 'Unknown Template';
            
            // Add preview URL
            if ($certificate->file_path && Storage::disk('public')->exists($certificate->file_path)) {
                $certificate->preview_url = Storage::disk('public')->url($certificate->file_path);
                $certificate->file_exists = true;
            } else {
                $certificate->preview_url = null;
                $certificate->file_exists = false;
            }
            
            return response()->json([
                'success' => true,
                'data' => $certificate
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in viewCertificate: ' . $e->getMessage(), [
                'certificate_id' => $certificateId,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Internal server error: ' . $e->getMessage()
            ], 500);
        }
    }
    
    private function generatePersonalizedCertificate($templatePath, $participantName, $eventTitle, $eventDate, $certificateNumber)
    {
        try {
            $templateFullPath = Storage::disk('public')->path($templatePath);
            $extension = pathinfo($templatePath, PATHINFO_EXTENSION);
            $personalizedFileName = 'certificates/' . $certificateNumber . '.' . $extension;
            $personalizedFullPath = Storage::disk('public')->path($personalizedFileName);
            
            // Ensure certificates directory exists
            $certificatesDir = Storage::disk('public')->path('certificates');
            if (!file_exists($certificatesDir)) {
                mkdir($certificatesDir, 0755, true);
            }
            
            // Debug log
            \Log::info('Generating certificate:', [
                'template_path' => $templateFullPath,
                'output_path' => $personalizedFullPath,
                'participant' => $participantName,
                'template_exists' => file_exists($templateFullPath)
            ]);
            
            // For image files, add text overlay
            if (in_array(strtolower($extension), ['jpg', 'jpeg', 'png']) && extension_loaded('gd')) {
                $this->addTextToImage($templateFullPath, $personalizedFullPath, $participantName, $eventTitle, $eventDate);
            } else {
                // For PDF or if GD not available, just copy the file
                if (file_exists($templateFullPath)) {
                    copy($templateFullPath, $personalizedFullPath);
                }
            }
            
            // Verify file was created
            if (file_exists($personalizedFullPath)) {
                \Log::info('Certificate created successfully: ' . $personalizedFullPath);
            } else {
                \Log::error('Certificate file not created: ' . $personalizedFullPath);
            }
            
            return $personalizedFileName;
        } catch (\Exception $e) {
            \Log::error('Error generating certificate: ' . $e->getMessage());
            
            // Fallback: just copy the template
            $templateFullPath = Storage::disk('public')->path($templatePath);
            $extension = pathinfo($templatePath, PATHINFO_EXTENSION);
            $personalizedFileName = 'certificates/' . $certificateNumber . '.' . $extension;
            $personalizedFullPath = Storage::disk('public')->path($personalizedFileName);
            
            if (file_exists($templateFullPath)) {
                copy($templateFullPath, $personalizedFullPath);
            }
            
            return $personalizedFileName;
        }
    }
    
    private function addTextToImage($templatePath, $outputPath, $participantName, $eventTitle, $eventDate)
    {
        // Load the template image
        $imageInfo = getimagesize($templatePath);
        $imageType = $imageInfo[2];
        
        switch ($imageType) {
            case IMAGETYPE_JPEG:
                $image = imagecreatefromjpeg($templatePath);
                break;
            case IMAGETYPE_PNG:
                $image = imagecreatefrompng($templatePath);
                break;
            default:
                copy($templatePath, $outputPath);
                return;
        }
        
        if (!$image) {
            copy($templatePath, $outputPath);
            return;
        }
        
        // Get image dimensions
        $width = imagesx($image);
        $height = imagesy($image);
        
        // Calculate font size - larger and more prominent
        $fontSize = max(48, $width / 18); // Minimum 48px, larger proportional to image
        
        // Try to use DejaVu Serif font for better quality
        $fontPath = public_path('fonts/DejaVuSerif-Bold.ttf');
        $useBuiltInFont = !file_exists($fontPath);
        
        // If no TTF, try alternative DejaVu Serif paths
        if ($useBuiltInFont) {
            $altPaths = [
                'C:\Windows\Fonts\DejaVuSerif-Bold.ttf',
                'C:\Windows\Fonts\DejaVuSerif.ttf',
                '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',
                '/System/Library/Fonts/DejaVuSerif.ttf'
            ];
            foreach ($altPaths as $path) {
                if (file_exists($path)) {
                    $fontPath = $path;
                    $useBuiltInFont = false;
                    break;
                }
            }
        }
        
        // Set elegant colors
        $textColor = imagecolorallocate($image, 25, 25, 112); // Midnight blue
        $shadowColor = imagecolorallocate($image, 200, 200, 200); // Light gray shadow
        $bgColor = imagecolorallocate($image, 255, 255, 255); // White background
        
        // Position name right below "SERTIFIKAT INI DIBERIKAN KEPADA" (around 50-55% from top)
        $nameY = $height * 0.52;
        
        if ($useBuiltInFont) {
            // Use larger built-in font with enhanced shadow effect
            $builtInSize = 5; // Maximum built-in font size
            $textWidth = strlen($participantName) * imagefontwidth($builtInSize);
            $nameX = ($width - $textWidth) / 2;
            
            // Add multiple shadow layers for depth
            imagestring($image, $builtInSize, $nameX + 3, $nameY + 3, strtoupper($participantName), $shadowColor);
            imagestring($image, $builtInSize, $nameX + 1, $nameY + 1, strtoupper($participantName), $shadowColor);
            // Main text
            imagestring($image, $builtInSize, $nameX, $nameY, strtoupper($participantName), $textColor);
        } else {
            // Use TTF font for much better quality and size
            $textBox = imagettfbbox($fontSize, 0, $fontPath, strtoupper($participantName));
            $textWidth = $textBox[4] - $textBox[0];
            $textHeight = $textBox[1] - $textBox[7];
            $nameX = ($width - $textWidth) / 2;
            
            // Add enhanced shadow effect for TTF
            imagettftext($image, $fontSize, 0, $nameX + 3, $nameY + 3, $shadowColor, $fontPath, strtoupper($participantName));
            imagettftext($image, $fontSize, 0, $nameX + 1, $nameY + 1, $shadowColor, $fontPath, strtoupper($participantName));
            
            // Add the participant name with TTF font (main text)
            imagettftext($image, $fontSize, 0, $nameX, $nameY, $textColor, $fontPath, strtoupper($participantName));
            
            // Add elegant underline decoration with better spacing
            $underlineY = $nameY + $textHeight + 12;
            $underlineWidth = 3;
            for ($i = 0; $i < $underlineWidth; $i++) {
                imageline($image, $nameX - 30, $underlineY + $i, $nameX + $textWidth + 30, $underlineY + $i, $textColor);
            }
        }
        
        // Save the image
        switch ($imageType) {
            case IMAGETYPE_JPEG:
                imagejpeg($image, $outputPath, 95);
                break;
            case IMAGETYPE_PNG:
                imagepng($image, $outputPath);
                break;
        }
        
        // Clean up
        imagedestroy($image);
    }
    
    private function sendCertificateEmail($participant, $event, $certificate)
    {
        try {
            if (!$participant->email) {
                \Log::warning('No email for participant: ' . $participant->name);
                return;
            }
            
            \Log::info('Sending certificate email to: ' . $participant->email);
            
            // Simple email using Laravel's Mail facade
            \Mail::raw(
                "Selamat! Sertifikat Anda untuk acara '{$event->title}' telah tersedia.\n\n" .
                "Nama: {$participant->name}\n" .
                "Nomor Sertifikat: {$certificate->certificate_number}\n" .
                "Link Sertifikat: " . url('/certificate/' . $certificate->id) . "\n\n" .
                "Anda dapat mengakses sertifikat melalui dashboard peserta SIMATRO.\n\n" .
                "Salam,\nTim SIMATRO Universitas Lampung",
                function ($message) use ($participant, $event) {
                    $message->to($participant->email, $participant->name)
                           ->subject("Sertifikat {$event->title} - SIMATRO Universitas Lampung")
                           ->from('noreply@simatro.unila.ac.id', 'SIMATRO Universitas Lampung');
                }
            );
            
            \Log::info('Certificate email sent successfully to: ' . $participant->email);
            
        } catch (\Exception $e) {
            \Log::error('Error sending certificate email: ' . $e->getMessage());
            // Continue execution even if email fails
        }
    }
    
    private function addCenteredText($image, $text, $imageWidth, $y, $color, $fontSize)
    {
        // Calculate text width for centering
        $textWidth = strlen($text) * imagefontwidth($fontSize);
        $x = ($imageWidth - $textWidth) / 2;
        
        // Add text to image
        imagestring($image, $fontSize, $x, $y, $text, $color);
    }
    
    public function generateAllCertificates($eventId)
    {
        $event = Event::findOrFail($eventId);
        
        // Get the latest template for this event
        $template = CertificateTemplate::where('event_id', $eventId)->latest()->first();
        
        if (!$template) {
            return response()->json([
                'success' => false,
                'message' => 'Template sertifikat belum diupload untuk event ini'
            ], 400);
        }
        
        // Get participants who attended the event
        $participants = Participant::where('event_id', $eventId)
            ->whereHas('attendances')
            ->get();
        
        if ($participants->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada peserta yang hadir untuk event ini'
            ], 400);
        }
        
        $generatedCount = 0;
        
        foreach ($participants as $participant) {
            // Check if certificate already exists
            $existingCertificate = Certificate::where('participant_id', $participant->id)
                ->where('template_id', $template->id)
                ->first();
                
            if (!$existingCertificate) {
                // Generate certificate number
                $certificateNumber = 'SIMATRO-' . strtoupper(substr($event->title, 0, 3)) . '-' . 
                                   date('Y') . '-' . str_pad($participant->id, 4, '0', STR_PAD_LEFT);
                
                // Create personalized certificate file
                $personalizedPath = $this->generatePersonalizedCertificate(
                    $template->file_path,
                    $participant->name,
                    $event->title,
                    Carbon::parse($event->date)->locale('id')->isoFormat('DD MMMM YYYY'),
                    $certificateNumber
                );
                
                // Create certificate record
                Certificate::create([
                    'participant_id' => $participant->id,
                    'event_id' => $event->id,
                    'template_id' => $template->id,
                    'certificate_number' => $certificateNumber,
                    'file_path' => $personalizedPath
                ]);
                
                $generatedCount++;
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => "Berhasil generate {$generatedCount} sertifikat untuk peserta yang hadir",
            'generated_count' => $generatedCount,
            'total_participants' => $participants->count()
        ]);
    }

    private function addCenteredTextTTF($image, $text, $imageWidth, $y, $color, $fontSize, $fontPath)
    {
        // Calculate text dimensions
        $textBox = imagettfbbox($fontSize, 0, $fontPath, $text);
        $textWidth = $textBox[4] - $textBox[0];
        $x = ($imageWidth - $textWidth) / 2;
        
        // Add text to image with TTF font
        imagettftext($image, $fontSize, 0, $x, $y, $color, $fontPath, $text);
    }
}
