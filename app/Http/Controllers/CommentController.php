<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, $threadId)
    {
        $comments = Comment::with('user', 'replies.user', 'replies.votes')
            ->where('commentable_id', $threadId)
            ->where('commentable_type', 'App\Models\Thread')
            ->whereNull('parent_id')
            ->withCount('replies')
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'body'             => 'required|string',
            'commentable_id'   => 'required|integer',
            'commentable_type' => 'required|in:App\Models\Thread,App\Models\Protocol',
            'parent_id'        => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'user_id'          => $request->user()->id,
            'commentable_id'   => $request->commentable_id,
            'commentable_type' => $request->commentable_type,
            'parent_id'        => $request->parent_id,
            'body'             => $request->body,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function update(Request $request, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate(['body' => 'required|string']);
        $comment->update(['body' => $request->body]);

        return response()->json($comment->load('user'));
    }

    public function destroy(Request $request, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(null, 204);
    }
}