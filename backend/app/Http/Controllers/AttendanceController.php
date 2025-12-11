<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Participant;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index()
    {
        return Attendance::with(['participant', 'event'])->get();
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

    public function destroy(Attendance $attendance)
    {
        return $attendance->delete();
    }
}
