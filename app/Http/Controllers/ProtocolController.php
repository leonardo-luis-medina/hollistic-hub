<?php

namespace App\Http\Controllers;

use App\Models\Protocol;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProtocolController extends Controller
{
    public function index(Request $request)
    {
        $query = Protocol::with('user')
            ->withCount('reviews')
            ->where('status', 'published');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }

        switch ($request->sort) {
            case 'most_reviewed':
                $query->orderBy('reviews_count', 'desc');
                break;
            case 'most_upvoted':
                $query->orderBy('views', 'desc');
                break;
            case 'top_rated':
                $query->withAvg('reviews', 'rating')
                      ->orderBy('reviews_avg_rating', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        return response()->json($query->paginate(15));
    }

    public function show(Protocol $protocol)
    {
        $protocol->increment('views');
        $protocol->load('user');
        $protocol->loadCount(['reviews', 'threads', 'comments']);

        return response()->json($protocol);
    }

    public function threads(Protocol $protocol)
    {
        $threads = $protocol->threads()
            ->with('user')
            ->withCount('comments')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($threads);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'tags'    => 'nullable|array',
            'status'  => 'nullable|in:draft,published',
        ]);

        $protocol = Protocol::create([
            'user_id' => $request->user()->id,
            'title'   => $request->title,
            'slug'    => Str::slug($request->title) . '-' . uniqid(),
            'content' => $request->content,
            'tags'    => $request->tags ?? [],
            'status'  => $request->status ?? 'published',
        ]);

        return response()->json($protocol->load('user'), 201);
    }

    public function update(Request $request, Protocol $protocol)
    {
        if ($protocol->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title'   => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'tags'    => 'nullable|array',
            'status'  => 'nullable|in:draft,published',
        ]);

        $protocol->update($request->only(['title', 'content', 'tags', 'status']));

        return response()->json($protocol->load('user'));
    }

    public function destroy(Request $request, Protocol $protocol)
    {
        if ($protocol->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $protocol->delete();

        return response()->json(null, 204);
    }
}