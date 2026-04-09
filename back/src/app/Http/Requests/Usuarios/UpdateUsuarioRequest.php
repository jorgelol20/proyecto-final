<?php

namespace App\Http\Requests\Usuarios;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nick' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:usuarios,email,' . $this->route('id'),
            'password' => 'sometimes|required|string|min:6',
            'es_admin' => 'sometimes|boolean',
            'avatar' => 'nullable|image|max:2048'
        ];
    }
}
