<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Protocol;
use App\Models\Thread;
use App\Observers\ProtocolObserver;
use App\Observers\ThreadObserver;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Protocol::observe(ProtocolObserver::class);
        Thread::observe(ThreadObserver::class);
    }
}