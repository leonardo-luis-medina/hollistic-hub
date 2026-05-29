<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Protocol;
use App\Models\Thread;
use App\Models\Comment;
use App\Models\Review;
use App\Models\Vote;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create 15 users
        $users = User::factory(15)->create();

        // Create 12 protocols
        $protocols = collect();
        for ($i = 0; $i < 12; $i++) {
            $protocol = Protocol::factory()->create([
                'user_id' => $users->random()->id,
            ]);
            $protocols->push($protocol);
        }

        // Create 10 threads linked to protocols
        $threads = collect();
        for ($i = 0; $i < 10; $i++) {
            $thread = Thread::factory()->create([
                'user_id'     => $users->random()->id,
                'protocol_id' => $protocols->random()->id,
            ]);
            $threads->push($thread);
        }

        // Create comments on threads (3-5 per thread)
        $threads->each(function ($thread) use ($users) {
            $commentCount = rand(3, 5);
            $comments = collect();

            for ($i = 0; $i < $commentCount; $i++) {
                $comment = Comment::factory()->create([
                    'user_id'          => $users->random()->id,
                    'commentable_id'   => $thread->id,
                    'commentable_type' => 'App\Models\Thread',
                    'parent_id'        => null,
                ]);
                $comments->push($comment);
            }

            // Add nested replies to some comments
            $comments->take(2)->each(function ($comment) use ($users, $thread) {
                Comment::factory()->create([
                    'user_id'          => $users->random()->id,
                    'commentable_id'   => $thread->id,
                    'commentable_type' => 'App\Models\Thread',
                    'parent_id'        => $comment->id,
                ]);
            });
        });

        // Create reviews on protocols (1-3 per protocol)
        $protocols->each(function ($protocol) use ($users) {
            $reviewers = $users->random(rand(1, 3));
            $reviewers->each(function ($user) use ($protocol) {
                Review::factory()->create([
                    'user_id'     => $user->id,
                    'protocol_id' => $protocol->id,
                ]);
            });
        });

        // Create votes on threads
        $threads->each(function ($thread) use ($users) {
            $voters = $users->random(rand(3, 8));
            $voters->each(function ($user) use ($thread) {
                Vote::factory()->create([
                    'user_id'      => $user->id,
                    'votable_id'   => $thread->id,
                    'votable_type' => 'App\Models\Thread',
                ]);
            });
        });

        // Create votes on comments
        Comment::all()->each(function ($comment) use ($users) {
            $voters = $users->random(rand(1, 4));
            $voters->each(function ($user) use ($comment) {
                Vote::factory()->create([
                    'user_id'      => $user->id,
                    'votable_id'   => $comment->id,
                    'votable_type' => 'App\Models\Comment',
                ]);
            });
        });

        $this->command->info('✅ Seeded 15 users, 12 protocols, 10 threads with comments, reviews and votes!');
    }
}