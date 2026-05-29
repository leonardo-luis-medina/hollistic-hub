<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'votable_id'   => 'required|integer',
            'votable_type' => 'required|in:App\Models\Thread,App\Models\Comment',
            'type'         => 'required|in:up,down',
        ]);

        $vote = Vote::updateOrCreate(
            [
                'user_id'      => $request->user()->id,
                'votable_id'   => $request->votable_id,
                'votable_type' => $request->votable_type,
            ],
            [
                'type' => $request->type,
            ]
        );

        return response()->json($vote, 201);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'votable_id'   => 'required|integer',
            'votable_type' => 'required|in:App\Models\Thread,App\Models\Comment',
        ]);

        Vote::where('user_id', $request->user()->id)
            ->where('votable_id', $request->votable_id)
            ->where('votable_type', $request->votable_type)
            ->delete();

        return response()->json(null, 204);
    }
}