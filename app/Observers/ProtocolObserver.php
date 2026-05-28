<?php

namespace App\Observers;

use App\Models\Protocol;
use App\Services\TypesenseService;

class ProtocolObserver
{
    public function saved(Protocol $protocol): void
    {
        app(TypesenseService::class)->indexProtocol($protocol);
    }

    public function deleted(Protocol $protocol): void
    {
        app(TypesenseService::class)->deleteProtocol($protocol->id);
    }
}