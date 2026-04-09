<?php

namespace App\Http\Controllers;

use App\Models\Especies;
use Illuminate\Http\Request;

class EspeciesController extends Controller
{
    /**
     * Reenvía al usuario a la vista index pasando las especies
     * @return \Illuminate\Contracts\View\View
     */
    public function index()
    {
        $especies = Especies::all();

        return view('especies.index',compact('especies'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Reenvía al usuario a los detalles de la especie
     * @param string $id
     * @return \Illuminate\Contracts\View\View
     */
    public function show(string $id)
    {
        $especie = Especies::findOrFail($id);

        return view('especies.show', compact('especie'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Especies $especies)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Especies $especies)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Especies $especies)
    {
        //
    }
}
