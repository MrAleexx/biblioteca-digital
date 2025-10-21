<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookContributor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'book_id',
        'contributor_type',
        'full_name',
        'email',
        'sequence_number',
        'biographical_note',
    ];

    protected $casts = [
        'sequence_number' => 'integer',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function scopeAuthors($query)
    {
        return $query->where('contributor_type', 'author');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sequence_number');
    }
}
