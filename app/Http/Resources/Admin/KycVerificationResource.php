<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KycVerificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $rawDocs = $this->documents ?? [];
        $nicNumber = $rawDocs['nicNumber'] ?? null;
        $skillName = $rawDocs['skillName'] ?? null;

        $docList = [];
        $labels = [
            'nicFront' => 'National Identity Card (Front)',
            'nicBack' => 'National Identity Card (Back)',
            'skillCert' => $skillName ? "Skill Certificate ({$skillName})" : 'Skill Certificate',
            'brCertificate' => 'Business Registration (BR)',
        ];

        foreach (['nicFront', 'nicBack', 'skillCert', 'brCertificate'] as $key) {
            if (!empty($rawDocs[$key]) && is_string($rawDocs[$key])) {
                $path = $rawDocs[$key];
                $url = asset('storage/' . $path);
                $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
                $docList[] = [
                    'id' => $key,
                    'key' => $key,
                    'name' => $labels[$key] ?? ucfirst($key),
                    'url' => $url,
                    'path' => $path,
                    'fileType' => in_array($ext, ['jpg', 'jpeg', 'png', 'webp']) ? 'IMAGE' : strtoupper($ext ?: 'PDF'),
                    'fileSize' => 'Uploaded Document',
                    'uploadDate' => $this->submitted_at?->format('M d, Y') ?? $this->created_at?->format('M d, Y'),
                ];
            }
        }

        return [
            'id' => $this->id,
            'provider_id' => $this->provider_id,
            'verification_type' => $this->verification_type,
            'status' => $this->status,
            'documents' => $docList,
            'nic_number' => $nicNumber,
            'skill_name' => $skillName,
            'reviewed_by' => $this->reviewed_by,
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'rejection_reason' => $this->rejection_reason,
            'provider' => new ProviderResource($this->whenLoaded('provider')),
            'reviewer' => new UserResource($this->whenLoaded('reviewer')),
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
