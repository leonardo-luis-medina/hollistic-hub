<?php

namespace App\Services;

use Typesense\Client;
use App\Models\Protocol;
use App\Models\Thread;

class TypesenseService
{
    protected Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'api_key' => config('typesense.api_key'),
            'nodes'   => config('typesense.nodes'),
            'connection_timeout_seconds' => config('typesense.connection_timeout_seconds'),
        ]);
    }

    public function client(): Client
    {
        return $this->client;
    }

    public function createCollections(): void
    {
        $this->createProtocolsCollection();
        $this->createThreadsCollection();
    }

    public function createProtocolsCollection(): void
    {
        try {
            $this->client->collections['protocols']->delete();
        } catch (\Exception $e) {}

        $this->client->collections->create([
            'name' => 'protocols',
            'fields' => [
                ['name' => 'id',         'type' => 'string'],
                ['name' => 'title',      'type' => 'string'],
                ['name' => 'content',    'type' => 'string'],
                ['name' => 'tags',       'type' => 'string[]', 'facet' => true],
                ['name' => 'author',     'type' => 'string'],
                ['name' => 'avg_rating', 'type' => 'float'],
                ['name' => 'views',      'type' => 'int32'],
                ['name' => 'created_at', 'type' => 'int64'],
            ],
            'default_sorting_field' => 'created_at',
        ]);
    }

    public function createThreadsCollection(): void
    {
        try {
            $this->client->collections['threads']->delete();
        } catch (\Exception $e) {}

        $this->client->collections->create([
            'name' => 'threads',
            'fields' => [
                ['name' => 'id',         'type' => 'string'],
                ['name' => 'title',      'type' => 'string'],
                ['name' => 'body',       'type' => 'string'],
                ['name' => 'tags',       'type' => 'string[]', 'facet' => true],
                ['name' => 'author',     'type' => 'string'],
                ['name' => 'vote_count', 'type' => 'int32'],
                ['name' => 'views',      'type' => 'int32'],
                ['name' => 'created_at', 'type' => 'int64'],
            ],
            'default_sorting_field' => 'created_at',
        ]);
    }

    public function indexProtocol(Protocol $protocol): void
    {
        try {
            $this->client->collections['protocols']->documents->upsert([
                'id'         => (string) $protocol->id,
                'title'      => $protocol->title,
                'content'    => strip_tags($protocol->content),
                'tags'       => $protocol->tags ?? [],
                'author'     => $protocol->user->name ?? '',
                'avg_rating' => (float) ($protocol->avg_rating ?? 0),
                'views'      => (int) $protocol->views,
                'created_at' => $protocol->created_at->timestamp,
            ]);
        } catch (\Exception $e) {
            \Log::warning('Typesense protocol index failed: ' . $e->getMessage());
        }
    }

    public function indexThread(Thread $thread): void
    {
        try {
            $this->client->collections['threads']->documents->upsert([
                'id'         => (string) $thread->id,
                'title'      => $thread->title,
                'body'       => strip_tags($thread->body),
                'tags'       => $thread->tags ?? [],
                'author'     => $thread->user->name ?? '',
                'vote_count' => (int) ($thread->vote_count ?? 0),
                'views'      => (int) $thread->views,
                'created_at' => $thread->created_at->timestamp,
            ]);
        } catch (\Exception $e) {
            \Log::warning('Typesense thread index failed: ' . $e->getMessage());
        }
    }

    public function deleteProtocol(int $id): void
    {
        try {
            $this->client->collections['protocols']->documents[(string)$id]->delete();
        } catch (\Exception $e) {}
    }

    public function deleteThread(int $id): void
    {
        try {
            $this->client->collections['threads']->documents[(string)$id]->delete();
        } catch (\Exception $e) {}
    }

    public function searchProtocols(string $query, array $params = []): array
    {
        return $this->client->collections['protocols']->documents->search(array_merge([
            'q'        => $query ?: '*',
            'query_by' => 'title,content,tags',
            'sort_by'  => 'created_at:desc',
            'per_page' => 15,
        ], $params));
    }

    public function searchThreads(string $query, array $params = []): array
    {
        return $this->client->collections['threads']->documents->search(array_merge([
            'q'        => $query ?: '*',
            'query_by' => 'title,body,tags',
            'sort_by'  => 'created_at:desc',
            'per_page' => 15,
        ], $params));
    }
}