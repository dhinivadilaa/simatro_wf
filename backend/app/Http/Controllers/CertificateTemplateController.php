<?php

namespace App\Http\Controllers;

use App\Models\CertificateTemplate;
use Illuminate\Http\Request;

class CertificateTemplateController extends Controller
{
    public function index()
    {
        return CertificateTemplate::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required',
            'template_name' => 'required',
            'file_path' => 'required'
        ]);

        return CertificateTemplate::create($request->all());
    }

    public function destroy(CertificateTemplate $template)
    {
        return $template->delete();
    }
}
