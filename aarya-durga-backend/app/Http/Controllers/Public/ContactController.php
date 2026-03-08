<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Models\ContactSubject;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Get all contact subjects.
     */
    public function subjects()
    {
        return response()->json(ContactSubject::orderBy('sort_order')->get());
    }

    /**
     * Store a contact submission.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $submission = ContactSubmission::create($validated);

        return response()->json([
            'message' => 'Your message has been received. We will get back to you soon.',
            'submission' => $submission,
        ], 201);
    }
}
