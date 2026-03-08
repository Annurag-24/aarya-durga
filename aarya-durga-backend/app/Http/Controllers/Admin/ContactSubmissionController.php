<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;

class ContactSubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            ContactSubmission::orderBy('created_at', 'desc')->get()
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactSubmission $contactSubmission)
    {
        return response()->json($contactSubmission);
    }

    /**
     * Update the status of a contact submission.
     */
    public function updateStatus(Request $request, ContactSubmission $contactSubmission)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read,resolved',
        ]);

        $contactSubmission->update($validated);

        return response()->json($contactSubmission);
    }

    /**
     * Remove the resource from storage.
     */
    public function destroy(ContactSubmission $contactSubmission)
    {
        $contactSubmission->delete();

        return response()->json(['message' => 'Contact submission deleted successfully']);
    }
}
