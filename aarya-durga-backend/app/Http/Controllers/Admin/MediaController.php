<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index()
    {
        return response()->json(Media::orderBy('created_at', 'desc')->get());
    }

    public function show(Media $media)
    {
        return response()->json($media);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:5120|mimes:jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx',
            'section' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $section = $request->input('section');

        // Generate filename
        if ($section) {
            $extension = $file->getClientOriginalExtension();
            $filename = "{$section}-section-image.{$extension}";
        } else {
            $filename = $file->getClientOriginalName();
        }

        $path = $file->storeAs('media', $filename, 'public');

        $media = Media::create([
            'filename' => $filename,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'path' => $path,
            'url' => Storage::url($path),
        ]);

        return response()->json($media, 201);
    }

    public function destroy(Media $media)
    {
        if ($media->path && Storage::disk('public')->exists($media->path)) {
            Storage::disk('public')->delete($media->path);
        }

        $media->delete();
        return response()->json(null, 204);
    }
}
