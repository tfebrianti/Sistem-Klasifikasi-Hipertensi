<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PredictionResource extends JsonResource
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
            'patientId' => $this->patient_id,
            'patientName' => $this->patient_name,
            'date' => $this->date,
            'modelUsed' => $this->model_used,
            'confidenceScore' => $this->confidence_score,
            'systolic' => (int)$this->systolic,
            'diastolic' => (int)$this->diastolic,
            'age' => (int)$this->age,
            'gender' => $this->gender,
            'weight' => (float)$this->weight,
            'height' => (float)$this->height,
            'bmi' => (float)$this->bmi,
            'result' => $this->result,
            'accuracyDT' => $this->accuracy_dt !== null ? (int)$this->accuracy_dt : null,
            'accuracyRF' => $this->accuracy_rf !== null ? (int)$this->accuracy_rf : null,
        ];
    }
}
