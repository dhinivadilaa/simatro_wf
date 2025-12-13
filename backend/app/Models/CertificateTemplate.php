<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'template_name',
        'content',
        'file_path'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}