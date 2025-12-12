<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'title',
        'topic',
        'description',
        'date',
        'location',
        'registration_open',
        'absent_deadline',
        'capacity',
        'thumbnail',
    ];

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function certificateTemplates()
    {
        return $this->hasMany(CertificateTemplate::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
}
