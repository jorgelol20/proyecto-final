<?php

namespace App\Http\Requests\Usuarios;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nick' => 'required|string|max:255',
            'email' => 'required|email|unique:usuarios,email',
            'password' => 'required|string|min:8|',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png'     
            ];
    }
    public function messages(){
      return  [
            'nick.required' => 'El nick es obligatorio.',
            'nick.max' => 'El nick no puede superar los 20 carácteres.',
            'nick.string' => 'El nick no puede estar vacío.',
            'nick.unique' => 'Este nick ya está en uso.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caractéres.',
            'password.string' => 'El password no puede estar vacío.',
            'email.email' => 'El email introducido no es válido.',
            'email.required' => 'El email es obligatorio.',
            'email.unique' => 'Este correo ya está en uso.',
            'avatar.max' => 'El avatar no puede superar los 2MB.',
            'avatar.mimes' => 'El formato del avatar no es válido.'
      ];
    }
}
