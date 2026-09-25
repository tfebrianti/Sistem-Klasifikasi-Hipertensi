<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of latest notifications for authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();

        $unreadCount = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        // Map notifications to API structure matching the frontend expectation
        $mappedNotifs = $notifications->map(function ($notif) {
            return [
                'id' => $notif->id,
                'title' => $notif->title,
                'desc' => $notif->desc,
                'type' => $notif->type,
                'isRead' => $notif->is_read,
                'createdAt' => $notif->created_at->toIso8601String(),
            ];
        });

        return response()->json([
            'notifications' => $mappedNotifs,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark all unread notifications of authenticated user as read
     */
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'Semua pemberitahuan berhasil ditandai sebagai sudah dibaca.'
        ]);
    }

    /**
     * Remove a specific notification
     */
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();

        $notification = Notification::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        $notification->delete();

        return response()->json([
            'message' => 'Pemberitahuan berhasil dihapus.'
        ]);
    }
}
