<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    public function index($event = null)
    {
        if ($event) {
            $materials = Material::where('event_id', $event)
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $materials
            ]);
        }
        
        return response()->json([
            'success' => true,
            'data' => Material::with('event')->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function store(Request $request, $eventId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,ppt,pptx,doc,docx|max:10240' // Max 10MB
        ]);

        // Verify event exists
        $event = Event::findOrFail($eventId);

        $file = $request->file('file');
        $path = $file->store('materials', 'public');

        $material = Material::create([
            'event_id' => $eventId,
            'title' => $request->title,
            'file_path' => $path,
            'filename' => $file->getClientOriginalName(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Material berhasil diupload',
            'data' => $material
        ], 201);
    }

    public function download(Material $material, Request $request)
    {
        if (!Storage::disk('public')->exists($material->file_path)) {
            return response()->json(['error' => 'File tidak ditemukan'], 404);
        }

        $filePath = Storage::disk('public')->path($material->file_path);
        $mimeType = Storage::disk('public')->mimeType($material->file_path);
        
        // Check if it's a preview request (for iframe)
        $isPreview = $request->query('preview') === 'true';
        
        if ($isPreview && $mimeType === 'application/pdf') {
            return response()->file($filePath, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'inline; filename="' . $material->filename . '"'
            ]);
        }
        
        // For download
        return response()->download($filePath, $material->filename, [
            'Content-Type' => $mimeType
        ]);
    }

    public function destroy(Material $material)
    {
        // Delete file from storage
        if (Storage::disk('public')->exists($material->file_path)) {
            Storage::disk('public')->delete($material->file_path);
        }

        $material->delete();

        return response()->json([
            'success' => true,
            'message' => 'Material berhasil dihapus'
        ]);
    }
}
