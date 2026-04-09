<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApiEventosPost extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
         return [
            'nombre'=> 'required|string|max:50',
            'tipo_evento'=> 'string|max:50',
            'tipo_terreno'=> 'string|max:50',
            'ubicacion'=> 'string|max:70',
            'fecha' => 'required|date|after:today',
            'descripcion' => 'string|max:300',
            'imagen' => 'max:10000',
            'pdf' => 'max:10000',
        ];
    }

     public function messages() {
        return [
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.max' => 'El nombre no puede superar los 20 carácteres',
            'tipo_evento.max' => 'El tipo del evento no puede superar los 50 carácteres',
            'tipo_terreno.max' => 'El tipo de terreno no puede superar los 50 carácteres',
            'ubicacion.max' => 'La ubicacion no puede superar los 70 carácteres',
            'fecha.requiered' => 'La fecha es un campo obligatorio',
            'fecha.after' => 'La fecha del evento tiene que ser posterior a hoy',
            'descripcion' => 'La descripcion no puede superar los 300 carácteres',
            'imagen.max' => 'La URL es demasiado larga',
            'pdf.max' => 'La URL es demasiado larga'
        ];
    }
}
