<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TypesenseService;
use App\Models\Protocol;
use App\Models\Thread;

class TypesenseReindex extends Command
{
    protected $signature   = 'typesense:reindex';
    protected $description = 'Reindex all protocols and threads to Typesense';

    public function handle(): void
    {
        $ts = app(TypesenseService::class);

        $this->info('Creating Typesense collections...');
        $ts->createCollections();

        $this->info('Indexing protocols...');
        Protocol::with('user')->get()->each(function ($protocol) use ($ts) {
            $ts->indexProtocol($protocol);
        });

        $this->info('Indexing threads...');
        Thread::with('user')->get()->each(function ($thread) use ($ts) {
            $ts->indexThread($thread);
        });

        $this->info('✅ Reindexed ' . Protocol::count() . ' protocols and ' . Thread::count() . ' threads.');
    }
}