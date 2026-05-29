<?php

namespace App\Http\Controllers;

use App\Models\Protocol;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Protocol $protocol)
    {
        $reviews = $protocol->reviews()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }

    public function store(Request $request, Protocol $protocol)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'body'   => 'nullable|string',
        ]);

        $review = Review::updateOrCreate(
            [
                'user_id'     => $request->user()->id,
                'protocol_id' => $protocol->id,
            ],
            [
                'rating' => $request->rating,
                'body'   => $request->body,
            ]
        );

        return response()->json($review->load('user'), 201);
    }

    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'body'   => 'nullable|string',
        ]);

        $review->update($request->only(['rating', 'body']));

        return response()->json($review->load('user'));
    }

    public function destroy(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json(null, 204);
    }
}