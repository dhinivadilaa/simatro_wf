<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;

class ParticipantController extends Controller
{
    public function index()
    {
        return Participant::with('event')->get();
    }

    /**
     * Store participant with nested route: /events/{event_id}/participants
     */
    public function store(Request $request, $event_id)
    {
        // Validasi hanya field input user
        $request->validate([
            'name' => 'required',
            'email' => 'nullable|email',
            'phone' => 'nullable',
        ]);

        // Simpan data participant
        $participant = Participant::create([
            'event_id' => $event_id,                     // Ambil event ID dari URL
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'registered_at' => now(),
        ]);

        return response()->json([
            "message" => "Participant registered successfully",
            "data" => $participant
        ], 201);
    }

    public function show(Participant $participant)
    {
        return $participant->load(['event', 'certificate']);
    }

    public function update(Request $request, Participant $participant)
    {
        $participant->update($request->all());
        return $participant;
    }

    public function destroy(Participant $participant)
    {
        $participant->delete();

        return response()->json([
            "message" => "Participant deleted"
        ]);
    }

    // PANITIA: Generate PIN
    public function generatePin(Participant $participant)
    {
        $participant->update([
            'pin' => rand(100000, 999999),
        ]);

        return [
            'message' => 'PIN generated',
            'pin' => $participant->pin
        ];
    }

    /**
     * Public: find participants by email (returns array of participant records)
     */
    public function findByEmail(Request $request)
    {
        $email = $request->query('email');
        if (!$email) {
            return response()->json(['message' => 'Email query required'], 400);
        }

        $participants = Participant::with(['event', 'certificate', 'attendances'])
            ->where('email', $email)
            ->get();

        if ($participants->isEmpty()) {
            return response()->json([], 200);
        }

        return response()->json($participants);
    }

    /**
     * Public: return riwayat (history) for a participant id.
     * This will return all registrations that share the same email as the given participant,
     * including related event, attendances and certificate.
     */
    public function riwayat(Participant $participant)
    {
        $email = $participant->email;

        if (!$email) {
            return response()->json(['message' => 'Participant has no email'], 400);
        }

        $riwayat = Participant::with(['event', 'certificate', 'attendances'])
            ->where('email', $email)
            ->get();

        return response()->json([
            'participant' => [
                'id' => $participant->id,
                'name' => $participant->name,
                'email' => $participant->email,
            ],
            'riwayat' => $riwayat,
        ]);
    }
}
