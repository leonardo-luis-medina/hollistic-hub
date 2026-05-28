<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProtocolController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\SearchController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Search (public)
Route::get('/search/protocols', [SearchController::class, 'protocols']);
Route::get('/search/threads',   [SearchController::class, 'threads']);

// Public read routes
Route::get('/protocols',                    [ProtocolController::class, 'index']);
Route::get('/protocols/{protocol:slug}',    [ProtocolController::class, 'show']);
Route::get('/protocols/{protocol}/threads', [ProtocolController::class, 'threads']);
Route::get('/protocols/{protocol}/reviews', [ReviewController::class, 'index']);
Route::get('/threads',                      [ThreadController::class, 'index']);
Route::get('/threads/{thread}',             [ThreadController::class, 'show']);
Route::get('/threads/{thread}/comments',    [CommentController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::post('/protocols',              [ProtocolController::class, 'store']);
    Route::put('/protocols/{protocol:slug}',   [ProtocolController::class, 'update']);
    Route::delete('/protocols/{protocol:slug}',[ProtocolController::class, 'destroy']);

    Route::post('/threads',          [ThreadController::class, 'store']);
    Route::put('/threads/{thread}',  [ThreadController::class, 'update']);
    Route::delete('/threads/{thread}',[ThreadController::class, 'destroy']);

    Route::post('/comments',           [CommentController::class, 'store']);
    Route::put('/comments/{comment}',  [CommentController::class, 'update']);
    Route::delete('/comments/{comment}',[CommentController::class, 'destroy']);

    Route::post('/protocols/{protocol}/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{review}',              [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}',           [ReviewController::class, 'destroy']);

    Route::post('/votes',   [VoteController::class, 'store']);
    Route::delete('/votes', [VoteController::class, 'destroy']);
});