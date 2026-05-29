<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Thread extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'protocol_id', 'title',
        'body', 'tags', 'is_pinned', 'views',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_pinned' => 'boolean',
    ];

    protected $appends = ['vote_count', 'upvote_count', 'downvote_count'];

    public function user() { return $this->belongsTo(User::class); }
    public function protocol() { return $this->belongsTo(Protocol::class); }
    public function comments() { return $this->morphMany(Comment::class, 'commentable'); }
    public function votes() { return $this->morphMany(Vote::class, 'votable'); }

    public function getVoteCountAttribute()
    {
        return $this->votes()->where('type', 'up')->count() -
               $this->votes()->where('type', 'down')->count();
    }

    public function getUpvoteCountAttribute()
    {
        return $this->votes()->where('type', 'up')->count();
    }

    public function getDownvoteCountAttribute()
    {
        return $this->votes()->where('type', 'down')->count();
    }
}