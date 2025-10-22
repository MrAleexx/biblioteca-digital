<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'publisher_id',
        'isbn',
        'language_code',
        'pages',
        'publication_year',
        'cover_image',
        'pdf_file',
        'is_active',
        'downloadable',
        'book_type',
        'total_downloads',
        'total_physical_copies',
        'available_physical_copies',
        'total_loans',
        'total_views',
        'featured',
        'access_level',
        'copyright_status',
        'license_type',
        'published_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'downloadable' => 'boolean',
        'featured' => 'boolean',
        'published_at' => 'datetime',
        'total_downloads' => 'integer',
        'total_physical_copies' => 'integer',
        'available_physical_copies' => 'integer',
        'total_loans' => 'integer',
        'total_views' => 'integer',
    ];

    // Relaciones
    public function publisher(): BelongsTo
    {
        return $this->belongsTo(Publisher::class);
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'language_code', 'code');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'book_category')
            ->withTimestamps();
    }

    public function details(): HasOne
    {
        return $this->hasOne(BookDetail::class);
    }

    public function contributors(): HasMany
    {
        return $this->hasMany(BookContributor::class)->orderBy('sequence_number');
    }

    // Accessors
    public function getAuthorsAttribute(): string
    {
        return $this->contributors()
            ->where('contributor_type', 'author')
            ->pluck('full_name')
            ->join(', ');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeDigital($query)
    {
        return $query->whereIn('book_type', ['digital', 'both']);
    }

    public function scopePhysical($query)
    {
        return $query->whereIn('book_type', ['physical', 'both']);
    }
}
