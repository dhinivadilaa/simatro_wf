<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Event::where('registration_open', true)
                ->withCount(['participants', 'attendances', 'certificates'])
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'date' => 'required',
        ]);

        $event = Event::create($request->all());

        return response()->json([
            'message' => 'Event created successfully',
            'data' => $event
        ]);
    }

    public function show(Event $event)
    {
        // Load relasi penting
        $event->load(['participants', 'attendances', 'certificates', 'materials', 'feedbacks']);

        // Tambahkan properti statistik berbasis relasi agar frontend mudah membaca
        $event->registered = $event->participants->count();
        $event->attended_count = $event->attendances->count();
        $event->certificates_count = $event->certificates->count();

        return response()->json([
            'data' => $event
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $event->update($request->all());

        return response()->json([
            'message' => 'Event updated',
            'data' => $event
        ]);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json([
            'message' => 'Event deleted'
        ]);
    }
}
