<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Models\ContactSubject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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
        $request->validate([
            'recaptcha_token' => 'required|string',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $recaptchaResponse = Http::withoutVerifying()->asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('services.recaptcha.secret'),
            'response' => $request->recaptcha_token,
            'remoteip' => $request->ip(),
        ])->json();

        if (!($recaptchaResponse['success'] ?? false) || ($recaptchaResponse['score'] ?? 0) < 0.5) {
            return response()->json(['message' => 'reCAPTCHA verification failed. Please try again.'], 422);
        }

        $validated = $request->only(['name', 'email', 'phone', 'subject', 'message']);
        $submission = ContactSubmission::create($validated);

        return response()->json([
            'message' => 'Your message has been received. We will get back to you soon.',
            'submission' => $submission,
        ], 201);
    }
}
