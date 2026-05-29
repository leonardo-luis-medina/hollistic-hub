<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'commentable_id', 'commentable_type',
        'parent_id', 'body',
    ];

    protected $appends = ['vote_count'];

    public function user() { return $this->belongsTo(User::class); }
    public function commentable() { return $this->morphTo(); }
    public function parent() { return $this->belongsTo(Comment::class, 'parent_id'); }
    public function replies() { return $this->hasMany(Comment::class, 'parent_id'); }
    public function votes() { return $this->morphMany(Vote::class, 'votable'); }

    public function getVoteCountAttribute()
    {
        return $this->votes()->where('type', 'up')->count() -
               $this->votes()->where('type', 'down')->count();
    }
}