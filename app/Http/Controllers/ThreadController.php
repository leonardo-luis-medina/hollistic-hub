<?php

namespace App\Http\Controllers;

use App\Models\Thread;
use Illuminate\Http\Request;

class ThreadController extends Controller
{
    public function index(Request $request)
    {
        $query = Thread::with('user', 'protocol')
            ->withCount('comments');

        if ($request->filled('protocol_id')) {
            $query->where('protocol_id', $request->protocol_id);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }

        switch ($request->sort) {
            case 'top_voted':
                $query->orderBy('views', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        return response()->json($query->paginate(15));
    }

    public function show(Thread $thread)
    {
        $thread->increment('views');
        $thread->load('user', 'protocol');
        $thread->loadCount('comments');

        return response()->json($thread);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'body'        => 'required|string',
            'protocol_id' => 'nullable|exists:protocols,id',
            'tags'        => 'nullable|array',
        ]);

        $thread = Thread::create([
            'user_id'     => $request->user()->id,
            'protocol_id' => $request->protocol_id,
            'title'       => $request->title,
            'body'        => $request->body,
            'tags'        => $request->tags ?? [],
        ]);

        return response()->json($thread->load('user', 'protocol'), 201);
    }

    public function update(Request $request, Thread $thread)
    {
        if ($thread->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'body'  => 'sometimes|string',
            'tags'  => 'nullable|array',
        ]);

        $thread->update($request->only(['title', 'body', 'tags']));

        return response()->json($thread->load('user', 'protocol'));
    }

    public function destroy(Request $request, Thread $thread)
    {
        if ($thread->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $thread->delete();

        return response()->json(null, 204);
    }
}