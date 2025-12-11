<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;

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

    public function destroy(Certificate $certificate)
    {
        return $certificate->delete();
    }
}
