<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Event::withCount('participants')->get()
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
        // Load relasi
        $event->load(['participants', 'materials', 'feedbacks']);

        // Hitung jumlah peserta
        $event->registered = $event->participants->count();

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
