<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ThreadFactory extends Factory
{
    private array $titles = [
        'Does this protocol actually work long term?',
        'Best time of day to follow this routine?',
        'Anyone combined this with intermittent fasting?',
        'Week 2 update — sharing my experience',
        'Modifications for beginners?',
        'What results did you see after 30 days?',
        'Is this safe for people with chronic conditions?',
        'Tips for staying consistent with this protocol',
        'Scientific evidence behind this approach?',
        'How to track progress effectively?',
        'Common mistakes to avoid',
        'Combining with other wellness protocols?',
    ];

    public function definition(): array
    {
        return [
            'title'     => fake()->randomElement($this->titles),
            'body'      => fake()->paragraphs(3, true),
            'tags'      => fake()->randomElements(
                ['nutrition', 'sleep', 'mental-health', 'exercise',
                 'breathwork', 'supplements', 'fasting', 'recovery'],
                fake()->numberBetween(1, 3)
            ),
            'is_pinned' => false,
            'views'     => fake()->numberBetween(10, 500),
        ];
    }
}