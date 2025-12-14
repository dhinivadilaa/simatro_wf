<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Event;
use App\Models\Participant;
use App\Models\CertificateTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CertificateController extends Controller
{
    public function index()
    {
        return Certificate::with(['participant', 'event'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'participant_id' => 'required',
            'event_id' => 'required',
            'template_id' => 'required',
            'file_path' => 'required'
        ]);

        return Certificate::create([
            'participant_id' => $request->participant_id,
            'event_id' => $request->event_id,
            'template_id' => $request->template_id,
            'certificate_number' => 'CERT-' . time(),
            'file_path' => $request->file_path
        ]);
    }

    public function generateAll($eventId)
    {
        try {
            $event = Event::findOrFail($eventId);
            
            // Get template for this event
            $template = CertificateTemplate::where('event_id', $eventId)->first();
            if (!$template) {
                return response()->json([
                    'success' => false,
                    'message' => 'Template sertifikat belum diupload untuk acara ini'
                ], 400);
            }

            // Get participants who attended but don't have certificates yet
            $attendedParticipants = Participant::where('event_id', $eventId)
                ->whereHas('attendances')
                ->where('certificate_issued', false)
                ->get();

            if ($attendedParticipants->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada peserta yang hadir atau semua sudah memiliki sertifikat'
                ], 400);
            }

            $generatedCount = 0;
            
            DB::transaction(function () use ($attendedParticipants, $eventId, $template, &$generatedCount) {
                foreach ($attendedParticipants as $participant) {
                    // Generate certificate
                    Certificate::create([
                        'participant_id' => $participant->id,
                        'event_id' => $eventId,
                        'template_id' => $template->id,
                        'certificate_number' => 'CERT-' . $eventId . '-' . $participant->id . '-' . time(),
                        'file_path' => 'certificates/cert-' . $participant->id . '-' . time() . '.pdf'
                    ]);

                    // Mark participant as having certificate
                    $participant->update(['certificate_issued' => true]);
                    $generatedCount++;
                }
            });

            return response()->json([
                'success' => true,
                'message' => "Berhasil membuat {$generatedCount} sertifikat",
                'generated_count' => $generatedCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat sertifikat: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Certificate $certificate)
    {
        return $certificate->delete();
    }
}
