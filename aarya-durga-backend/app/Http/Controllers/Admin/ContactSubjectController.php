<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubject;
use Illuminate\Http\Request;

class ContactSubjectController extends Controller
{
    public function index()
    {
        return response()->json(ContactSubject::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label_en' => 'required|string',
            'label_hi' => 'required|string',
            'label_mr' => 'required|string',
            'sort_order' => 'integer',
        ]);

        $contactSubject = ContactSubject::create($validated);
        return response()->json($contactSubject, 201);
    }

    public function show(ContactSubject $contactSubject)
    {
        return response()->json($contactSubject);
    }

    public function update(Request $request, ContactSubject $contactSubject)
    {
        $validated = $request->validate([
            'label_en' => 'string',
            'label_hi' => 'string',
            'label_mr' => 'string',
            'sort_order' => 'integer',
        ]);

        $contactSubject->update($validated);
        return response()->json($contactSubject);
    }

    public function destroy(ContactSubject $contactSubject)
    {
        $contactSubject->forceDelete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:contact_subjects,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            ContactSubject::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Contact subjects reordered successfully']);
    }
}
