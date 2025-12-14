<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Event;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request, Event $event)
    {
        try {
            $request->validate([
                'participant_email' => 'required|email',
                'rating' => 'required|integer|min:1|max:5',
                'comments' => 'nullable|string|max:1000'
            ]);

            $feedback = Feedback::create([
                'event_id' => $event->id,
                'participant_email' => $request->participant_email,
                'rating' => $request->rating,
                'comments' => $request->comments
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Feedback berhasil disimpan',
                'data' => $feedback
            ]);
        } catch (\Exception $e) {
            \Log::error('Feedback error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan feedback: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index($eventId)
    {
        $feedbacks = Feedback::where('event_id', $eventId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $feedbacks
        ]);
    }
}