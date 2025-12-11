<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'title',
        'file_path',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
