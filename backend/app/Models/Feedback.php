<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';
    
    protected $fillable = [
        'event_id',
        'participant_email',
        'rating',
        'comments'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}