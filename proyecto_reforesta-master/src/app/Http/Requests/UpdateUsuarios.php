<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUsuarios extends FormRequest
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
            
            'nombre'=> 'string|max:20',
            'apellidos'=> 'string|max:50',
            'avatar' => 'max:300'
        ];
    }

     /**
      * Summary of messages
      * @return array{apellidos.max: string, apellidos.string: string, avatar.max: string, nombre.max: string, nombre.string: string}
      */
     public function messages(){
      return  [
            'nombre.max' => 'El nombre no puede superar los 20 carácteres',
            'nombre.string' => 'El nombre no puede estar vacío',
            'apellidos.max' => 'El apellido no puede superar los 50 carácteres',
            'apellidos.string' => 'Apellidos no puede estar vacío',
            'avatar.max' => 'El avatar no puede superar los 300 carácteres'
      ];
    }
}
