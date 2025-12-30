<?php

namespace App\Traits;

use App\Models\Resolution;
use App\Models\LeadershipPosition;
use App\Models\Appeal;
use Illuminate\Support\Facades\DB;

trait RequiresResolution
{
    /**
     * Validate that a resolution can be used for execution
     * 
     * @param Resolution $resolution
     * @param string $requiredType
     * @param string $requiredCategory
     * @param array $targetValidation ['key' => 'value'] to check in proposed_action
     * @return array ['valid' => bool, 'error' => string|null]
     */
    protected function validateResolutionForExecution(
        Resolution $resolution,
        string $requiredType,
        string $requiredCategory,
        array $targetValidation = []
    ): array {
        // 1. Check status is 'passed'
        if ($resolution->status !== 'passed') {
            return [
                'valid' => false,
                'error' => 'Resolution must have "passed" status. Current status: ' . $resolution->status
            ];
        }

        // 2. Check not already executed
        if ($resolution->executed_at) {
            return [
                'valid' => false,
                'error' => 'Resolution has already been executed on ' . $resolution->executed_at->format('Y-m-d H:i:s')
            ];
        }

        // 3. Check type matches
        if ($resolution->type !== $requiredType) {
            return [
                'valid' => false,
                'error' => "Invalid resolution type. Required: {$requiredType}, Got: {$resolution->type}"
            ];
        }

        // 4. Check category matches
        if ($resolution->category !== $requiredCategory) {
            return [
                'valid' => false,
                'error' => "Invalid resolution category. Required: {$requiredCategory}, Got: {$resolution->category}"
            ];
        }

        // 5. Validate target from proposed_action
        $proposedAction = $resolution->proposed_action;
        if (!is_array($proposedAction)) {
            return [
                'valid' => false,
                'error' => 'Resolution proposed_action is invalid or missing'
            ];
        }

        foreach ($targetValidation as $key => $expectedValue) {
            if (!isset($proposedAction[$key]) || $proposedAction[$key] != $expectedValue) {
                return [
                    'valid' => false,
                    'error' => "Resolution target mismatch. Expected {$key}={$expectedValue}"
                ];
            }
        }

        // 6. Check for active appeals that freeze execution
        $hasActiveAppeal = Appeal::where('resolution_id', $resolution->id)
            ->whereIn('status', ['filed', 'admitted', 'under_review'])
            ->where('freezes_execution', true)
            ->exists();

        if ($hasActiveAppeal) {
            return [
                'valid' => false,
                'error' => 'Execution is frozen due to an active appeal'
            ];
        }

        // All validations passed
        return ['valid' => true, 'error' => null];
    }

    /**
     * Execute an action with resolution tracking
     * 
     * @param Resolution $resolution
     * @param callable $action - Callback that performs the actual action
     * @param string|null $executionNotes
     * @return void
     */
    protected function executeWithResolution(
        Resolution $resolution,
        callable $action,
        ?string $executionNotes = null
    ): void {
        // Get executor's leadership position
        $leadershipPosition = LeadershipPosition::where('member_id', auth()->user()->member->id ?? null)
            ->where('is_current', true)
            ->first();

        if (!$leadershipPosition) {
            throw new \Exception('You must hold an active portfolio to execute resolutions.');
        }

        // Execute in transaction
        DB::transaction(function() use ($resolution, $action, $leadershipPosition, $executionNotes) {
            // 1. Execute the actual action
            $action();

            // 2. Mark resolution as executed
            $resolution->update([
                'executed_by' => $leadershipPosition->id,
                'executed_at' => now(),
                'execution_notes' => $executionNotes ?? "Executed by {$leadershipPosition->position_title}",
                'status' => 'executed',
            ]);
        });
    }

    /**
     * Get current user's leadership position or fail
     */
    protected function getCurrentLeadershipPosition(): LeadershipPosition
    {
        $position = LeadershipPosition::where('member_id', auth()->user()->member->id ?? null)
            ->where('is_current', true)
            ->first();

        if (!$position) {
            throw new \Exception('You must hold an active portfolio.');
        }

        return $position;
    }
}
