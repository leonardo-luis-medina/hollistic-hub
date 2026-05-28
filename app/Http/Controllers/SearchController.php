<?php

namespace App\Http\Controllers;

use App\Services\TypesenseService;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function protocols(Request $request)
    {
        $ts     = app(TypesenseService::class);
        $query  = $request->get('q', '*');
        $page   = $request->get('page', 1);
        $sortBy = $request->get('sort_by', 'created_at:desc');

        $params = [
            'per_page' => 15,
            'page'     => $page,
            'sort_by'  => $sortBy,
        ];

        if ($request->filled('filter_by')) {
            $params['filter_by'] = $request->filter_by;
        }

        try {
            $results = $ts->searchProtocols($query, $params);
            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function threads(Request $request)
    {
        $ts     = app(TypesenseService::class);
        $query  = $request->get('q', '*');
        $page   = $request->get('page', 1);
        $sortBy = $request->get('sort_by', 'created_at:desc');

        $params = [
            'per_page' => 15,
            'page'     => $page,
            'sort_by'  => $sortBy,
        ];

        if ($request->filled('filter_by')) {
            $params['filter_by'] = $request->filter_by;
        }

        try {
            $results = $ts->searchThreads($query, $params);
            return response()->json($results);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}