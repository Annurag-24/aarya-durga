<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function index()
    {
        return response()->json(Quote::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'quote_en' => 'required|string',
            'quote_hi' => 'required|string',
            'quote_mr' => 'required|string',
            'placement' => 'required|in:header,footer,sidebar,modal',
            'is_active' => 'boolean',
        ]);

        $quote = Quote::create($validated);
        return response()->json($quote, 201);
    }

    public function show(Quote $quote)
    {
        return response()->json($quote);
    }

    public function update(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'quote_en' => 'string',
            'quote_hi' => 'string',
            'quote_mr' => 'string',
            'placement' => 'in:header,footer,sidebar,modal',
            'is_active' => 'boolean',
        ]);

        $quote->update($validated);
        return response()->json($quote);
    }

    public function destroy(Quote $quote)
    {
        $quote->delete();
        return response()->json(null, 204);
    }

    public function byPlacement($placement)
    {
        $quotes = Quote::where('placement', $placement)
            ->where('is_active', true)
            ->get();

        return response()->json($quotes);
    }
}
