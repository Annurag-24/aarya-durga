<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BankDetail;
use Illuminate\Http\Request;

class BankDetailController extends Controller
{
    public function index()
    {
        return response()->json(
            BankDetail::with('qrImage')->orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        $bankDetail = BankDetail::create($validated);
        return response()->json($bankDetail->load('qrImage'), 201);
    }

    public function show(BankDetail $bankDetail)
    {
        return response()->json($bankDetail->load('qrImage'));
    }

    public function update(Request $request, BankDetail $bankDetail)
    {
        $validated = $request->validate($this->rules());

        $bankDetail->update($validated);
        return response()->json($bankDetail->load('qrImage'));
    }

    public function destroy(BankDetail $bankDetail)
    {
        $bankDetail->delete();
        return response()->json(null, 204);
    }

    private function rules(): array
    {
        return [
            'account_name' => 'nullable|string',
            'bank_name' => 'nullable|string',
            'branch' => 'nullable|string',
            'account_number' => 'nullable|string',
            'ifsc_code' => 'nullable|string',
            'upi_id' => 'nullable|string',
            'qr_image_id' => 'nullable|exists:media,id',
            'sort_order' => 'integer',
        ];
    }
}
