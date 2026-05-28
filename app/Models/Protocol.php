<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Protocol extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'title', 'slug', 'content',
        'tags', 'status', 'views',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    protected $appends = ['avg_rating', 'vote_count'];

    public function user() { return $this->belongsTo(User::class); }
    public function threads() { return $this->hasMany(Thread::class); }
    public function reviews() { return $this->hasMany(Review::class); }
    public function comments() { return $this->morphMany(Comment::class, 'commentable'); }

    public function getAvgRatingAttribute()
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    public function getVoteCountAttribute()
    {
        return 0;
    }
}