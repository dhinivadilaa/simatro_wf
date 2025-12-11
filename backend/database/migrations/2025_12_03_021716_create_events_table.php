<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            // Dari UI
            $table->string('category');             // seperti “Teknik Elektro”, “Workshop”
            $table->string('title');                // Judul acara
            $table->string('topic')->nullable();    // Ringkasan singkat (untuk card)
            
            $table->text('description')->nullable(); // Deskripsi detail acara
            
            $table->date('date');                   // Tanggal acara
            $table->string('location')->nullable(); // Lokasi
            
            $table->boolean('registration_open')->default(true);
            // true  → tombol kuning “Lihat Detail Acara”
            // false → tombol abu “Pendaftaran Ditutup”
            
            $table->string('thumbnail')->nullable(); // foto card
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('events');
    }
};
