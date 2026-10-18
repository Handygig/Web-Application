<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => sprintf('CAT-%03d', $this->id),
            'name' => $this->service_name,
            'service_name' => $this->service_name,
            'description' => $this->description ?? '',
            'image' => $this->image,
            'image_url' => $this->image_url,
            'is_active' => (bool) $this->is_active,
            'status' => $this->is_active ? 'Active' : 'Inactive',
            'servicesCount' => $this->services_count ?? ($this->relationLoaded('services') ? $this->services->count() : 0),
            'jobRequestsCount' => $this->job_requests_count ?? ($this->relationLoaded('jobRequests') ? $this->jobRequests->count() : 0),
            'providersCount' => $this->providers_count ?? ($this->relationLoaded('providers') ? $this->providers->count() : 0),
            'createdDate' => $this->created_at ? $this->created_at->format('M d, Y') : '',
            'created_at' => $this->created_at,
        ];
    }
}
