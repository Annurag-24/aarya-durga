<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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
            'file' => 'required|file|max:102400|mimes:jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,mp4,webm,mov,ogg,avi,mkv',
            'section' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $section = $request->input('section');

        // Generate filename
        $extension = $file->getClientOriginalExtension();
        if ($section) {
            $filename = sprintf(
                '%s-section-image-%s.%s',
                $section,
                Str::uuid()->toString(),
                $extension
            );
        } else {
            $filename = sprintf(
                '%s-%s.%s',
                pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                Str::uuid()->toString(),
                $extension
            );
        }

        $path = $file->storeAs('media', $filename, 'public');

        $media = Media::create([
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'file_path' => $path,
            'file_url' => Storage::url($path),
        ]);

        return response()->json($media, 201);
    }

    public function destroy(Media $media)
    {
        if ($media->file_path && Storage::disk('public')->exists($media->file_path)) {
            Storage::disk('public')->delete($media->file_path);
        }

        $media->delete();
        return response()->json(null, 204);
    }
}
