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
            'category' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'topic' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'location' => 'nullable|string|max:255',
            'registration_open' => 'boolean',
            'absent_deadline' => 'nullable|date_format:H:i',
            'capacity' => 'nullable|integer|min:1',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Convert empty strings to null for optional fields
        $data = $request->all();
        if (isset($data['absent_deadline']) && $data['absent_deadline'] === '') {
            $data['absent_deadline'] = null;
        }
        if (isset($data['capacity']) && $data['capacity'] === '') {
            $data['capacity'] = null;
        }

        // Convert string boolean to actual boolean
        if (isset($data['registration_open'])) {
            $data['registration_open'] = $data['registration_open'] === '1' || $data['registration_open'] === true;
        }

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $data['thumbnail'] = $thumbnailPath;
        }

        $event = Event::create($data);

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
