<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function index()
    {
        return Material::with('event')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required',
            'title' => 'required',
            'file_path' => 'required'
        ]);

        return Material::create($request->all());
    }

    public function destroy(Material $material)
    {
        return $material->delete();
    }
}
