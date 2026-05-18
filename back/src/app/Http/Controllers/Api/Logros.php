<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LogrosController extends Controller
{
    public function index()
    {
        return response()->json(Logros::all());
    }

    public function show($id)
    {
        return response()->json(Logros::findOrFail($id));
    }
}
