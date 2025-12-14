<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Participant;
use App\Models\Event;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index()
    {
        return Attendance::with(['participant', 'event'])->get();
    }

    public function list($eventId)
    {
        $attendances = Attendance::with('participant')
            ->where('event_id', $eventId)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $attendances
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required',
            'email' => 'required',
            'pin' => 'required'
        ]);

        $participant = Participant::where('email', $request->email)
            ->where('event_id', $request->event_id)
            ->where('pin', $request->pin)
            ->first();

        if (!$participant) {
            return response()->json(['error' => 'Invalid PIN'], 400);
        }

        return Attendance::create([
            'participant_id' => $participant->id,
            'event_id' => $participant->event_id,
            'check_in_time' => now(),
            'check_in_method' => 'pin'
        ]);
    }

    public function checkAttendance(Request $request)
    {
        $request->validate([
            'event_id' => 'required',
            'email' => 'required',
            'pin' => 'required',
            'proof_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:5120'
        ]);

        $event = Event::findOrFail($request->event_id);
        
        // Check if event has attendance PIN
        if (!$event->attendance_pin || $event->attendance_pin !== $request->pin) {
            return response()->json(['error' => 'PIN absensi tidak valid'], 400);
        }

        $participant = Participant::where('email', $request->email)
            ->where('event_id', $request->event_id)
            ->first();

        if (!$participant) {
            return response()->json(['error' => 'Peserta tidak ditemukan'], 404);
        }

        // Check if already attended
        $existingAttendance = Attendance::where('participant_id', $participant->id)
            ->where('event_id', $request->event_id)
            ->first();

        if ($existingAttendance) {
            return response()->json(['error' => 'Sudah melakukan absensi'], 400);
        }

        $proofPhotoPath = null;
        if ($request->hasFile('proof_photo')) {
            $proofPhotoPath = $request->file('proof_photo')->store('attendance-proofs', 'public');
            \Log::info('Proof photo uploaded: ' . $proofPhotoPath);
        } else {
            \Log::info('No proof photo uploaded');
        }

        $attendance = Attendance::create([
            'participant_id' => $participant->id,
            'event_id' => $participant->event_id,
            'check_in_time' => \Carbon\Carbon::now('Asia/Jakarta'),
            'check_in_method' => 'pin',
            'proof_photo' => $proofPhotoPath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Absensi berhasil dicatat',
            'data' => $attendance
        ]);
    }

    public function getPin($eventId)
    {
        $event = Event::findOrFail($eventId);
        
        return response()->json([
            'success' => true,
            'pin' => $event->attendance_pin
        ]);
    }

    public function generatePin(Request $request, $eventId)
    {
        try {
            $event = Event::findOrFail($eventId);
            $pin = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            $event->attendance_pin = $pin;
            
            if ($request->has('deadline')) {
                $deadline = \Carbon\Carbon::parse($request->deadline);
                $event->absent_deadline = $deadline;
            }
            
            $event->save();
            
            return response()->json([
                'success' => true,
                'pin' => $pin,
                'deadline' => $event->absent_deadline,
                'message' => 'PIN absensi berhasil dibuat'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat PIN: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updatePin(Request $request, $eventId)
    {
        $request->validate([
            'pin' => 'required|string|max:10'
        ]);

        $event = Event::findOrFail($eventId);
        $event->attendance_pin = $request->pin;
        $event->save();

        return response()->json([
            'success' => true,
            'message' => 'PIN berhasil diubah',
            'pin' => $event->attendance_pin
        ]);
    }

    public function exportExcel($eventId)
    {
        $event = Event::with(['participants.attendances'])->findOrFail($eventId);
        
        $participants = $event->participants->map(function($participant) {
            $attendance = $participant->attendances->first();
            return [
                'Nama' => $participant->name,
                'Email' => $participant->email,
                'Status' => $attendance ? 'Hadir' : 'Tidak Hadir',
                'Waktu Absensi' => $attendance ? $attendance->check_in_time : '-',
                'Bukti Foto' => $attendance && $attendance->proof_photo ? 'Ada' : 'Tidak Ada'
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => [
                'event_title' => $event->title,
                'participants' => $participants
            ]
        ]);
    }

    public function destroy(Attendance $attendance)
    {
        return $attendance->delete();
    }
}
