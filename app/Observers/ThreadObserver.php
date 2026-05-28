<?php

namespace App\Observers;

use App\Models\Thread;
use App\Services\TypesenseService;

class ThreadObserver
{
    public function saved(Thread $thread): void
    {
        app(TypesenseService::class)->indexThread($thread);
    }

    public function deleted(Thread $thread): void
    {
        app(TypesenseService::class)->deleteThread($thread->id);
    }
}