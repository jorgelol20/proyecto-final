<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UsuariosPost extends FormRequest
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
            'nick'=> 'required|string|max:20|unique:usuarios,nick',
            'nombre'=> 'required|string|max:20',
            'apellidos'=> 'string|max:50',
            'password'=> 'required|string|max:64',
            'email' => 'required|string|max:50|unique:usuarios,email',
            'avatar' => 'max:300'
        ];
    }
    
    /**
     * Summary of messages
     * @return array{apellidos.max: string, apellidos.string: string, avatar.max: string, email.max: string, email.required: string, email.string: string, email.unique: string, nick.max: string, nick.required: string, nick.string: string, nick.unique: string, nombre.max: string, nombre.required: string, nombre.string: string, password.max: string, password.required: string, password.string: string}
     */
    public function messages(){
      return  [
            'nick.required' => 'El nick es obligatorio',
            'nick.max' => 'El nick no puede superar los 20 carácteres',
            'nick.string' => 'El nick no puede estar vacío',
            'nick.unique' => 'Este nick ya está en uso',
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.max' => 'El nombre no puede superar los 20 carácteres',
            'nombre.string' => 'El nombre no puede estar vacío',
            'apellidos.max' => 'El apellido no puede superar los 50 carácteres',
            'apellidos.string' => 'Apellidos no puede estar vacío',
            'password.required' => 'La contraseña es obligatoria',
            'password.max' => 'La contraseña no puede superar los 64 carácteres',
            'password.string' => 'El password no puede estar vacío',
            'email.max' => 'El email no puede superar los 50 carácteres',
            'email.string' => 'El email no puede estar vacío',
            'email.required' => 'El email es obligatorio',
            'email.unique' => 'Este correo ya está en uso',
            'avatar.max' => 'El avatar no puede superar los 300 carácteres'
      ];
    }
}
