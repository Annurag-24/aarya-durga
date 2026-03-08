<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommitteeMember;
use Illuminate\Http\Request;

class CommitteeMemberController extends Controller
{
    public function index()
    {
        return response()->json(CommitteeMember::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'role_en' => 'required|string',
            'role_hi' => 'required|string',
            'role_mr' => 'required|string',
            'bio_en' => 'nullable|string',
            'bio_hi' => 'nullable|string',
            'bio_mr' => 'nullable|string',
            'photo_id' => 'nullable|exists:media,id',
            'sort_order' => 'integer',
        ]);

        $committeeMember = CommitteeMember::create($validated);
        return response()->json($committeeMember, 201);
    }

    public function show(CommitteeMember $committeeMember)
    {
        return response()->json($committeeMember);
    }

    public function update(Request $request, CommitteeMember $committeeMember)
    {
        $validated = $request->validate([
            'name' => 'string',
            'role_en' => 'string',
            'role_hi' => 'string',
            'role_mr' => 'string',
            'bio_en' => 'nullable|string',
            'bio_hi' => 'nullable|string',
            'bio_mr' => 'nullable|string',
            'photo_id' => 'nullable|exists:media,id',
            'sort_order' => 'integer',
        ]);

        $committeeMember->update($validated);
        return response()->json($committeeMember);
    }

    public function destroy(CommitteeMember $committeeMember)
    {
        $committeeMember->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:committee_members,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            CommitteeMember::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Committee members reordered successfully']);
    }
}
