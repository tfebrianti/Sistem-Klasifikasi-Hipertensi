<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'age' => $this->age,
            'gender' => $this->gender,
            'phone' => $this->phone ?? '',
            'email' => $this->email ?? '',
            'address' => $this->address ?? '',
            'status' => $this->status,
            'lastChecked' => $this->last_checked ?? '',
            'bpHistory' => $this->bp_history ?? [],
        ];
    }
}
