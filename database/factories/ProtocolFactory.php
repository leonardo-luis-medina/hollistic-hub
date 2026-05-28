<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProtocolFactory extends Factory
{
    private static int $index = 0;

    private array $protocols = [
        [
            'title' => '7-Day Anti-Inflammatory Reset Diet',
            'tags'  => ['nutrition', 'gut-health'],
        ],
        [
            'title' => 'Cold Exposure Therapy for Recovery',
            'tags'  => ['cold-therapy', 'recovery'],
        ],
        [
            'title' => 'Breathwork Protocol for Anxiety Relief',
            'tags'  => ['breathwork', 'mental-health'],
        ],
        [
            'title' => 'Gut Healing 30-Day Protocol',
            'tags'  => ['gut-health', 'nutrition'],
        ],
        [
            'title' => 'Sleep Optimization: The Complete Guide',
            'tags'  => ['sleep', 'recovery'],
        ],
        [
            'title' => 'Intermittent Fasting for Beginners',
            'tags'  => ['fasting', 'nutrition'],
        ],
        [
            'title' => 'Magnesium Supplementation Protocol',
            'tags'  => ['supplements', 'sleep'],
        ],
        [
            'title' => 'Digital Detox Weekend Plan',
            'tags'  => ['mental-health', 'mindfulness'],
        ],
        [
            'title' => 'Morning Sunlight Exposure Routine',
            'tags'  => ['recovery', 'mindfulness'],
        ],
        [
            'title' => 'Trauma Release Exercises (TRE) Guide',
            'tags'  => ['mental-health', 'exercise'],
        ],
        [
            'title' => 'Adaptogen Stack for Stress Management',
            'tags'  => ['supplements', 'mental-health'],
        ],
        [
            'title' => 'Grounding & Earthing Daily Practice',
            'tags'  => ['mindfulness', 'recovery'],
        ],
    ];

    public function definition(): array
    {
        $protocol = $this->protocols[self::$index % count($this->protocols)];
        self::$index++;

        $title = $protocol['title'];
        $slug  = Str::slug($title) . '-' . uniqid();

        $content = "## Overview\n\n" . fake()->paragraphs(2, true) . "\n\n" .
                   "## Week 1 — Foundation\n\n" . fake()->paragraphs(2, true) . "\n\n" .
                   "## Week 2 — Deepening\n\n" . fake()->paragraphs(2, true) . "\n\n" .
                   "## Key Benefits\n\n" .
                   "- " . fake()->sentence() . "\n" .
                   "- " . fake()->sentence() . "\n" .
                   "- " . fake()->sentence() . "\n\n" .
                   "## Important Notes\n\n" . fake()->paragraph();

        return [
            'title'   => $title,
            'slug'    => $slug,
            'content' => $content,
            'tags'    => $protocol['tags'],
            'status'  => 'published',
            'views'   => fake()->numberBetween(50, 2000),
        ];
    }
}