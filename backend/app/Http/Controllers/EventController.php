<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::withCount([
            'participants',
            'attendances', 
            'certificates',
            'materials'
        ])
        ->orderBy('created_at', 'desc')
        ->get();
            
        return response()->json([
            'success' => true,
            'data' => $events
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
        // Load relasi dengan count
        $event->loadCount([
            'participants',
            'attendances', 
            'certificates',
            'materials'
        ]);

        return response()->json([
            'success' => true,
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

    public function uploadThumbnail(Request $request, $eventId)
    {
        $request->validate([
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $event = Event::findOrFail($eventId);
        
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($event->thumbnail && Storage::disk('public')->exists($event->thumbnail)) {
                Storage::disk('public')->delete($event->thumbnail);
            }
            
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $event->update(['thumbnail' => $thumbnailPath]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Thumbnail uploaded successfully',
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
