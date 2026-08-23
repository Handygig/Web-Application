<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $action = $request->input('action');

        $query = AuditLog::with('admin');

        if ($search) {
            $query->where('description', 'like', "%{$search}%")
                ->orWhere('action', 'like', "%{$search}%");
        }

        if ($action && $action !== 'all') {
            $query->where('action', $action);
        }

        $logs = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/AuditLog/Index', [
            'logs' => $logs,
            'filters' => [
                'search' => $search ?? '',
                'action' => $action ?? 'all',
            ],
        ]);
    }
}
