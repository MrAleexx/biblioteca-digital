<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookDetail extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'book_id',
        'description',
        'edition',
        'file_format',
        'file_size',
        'reading_age',
        'deposito_legal',
        'restrictions',
        'notes',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
