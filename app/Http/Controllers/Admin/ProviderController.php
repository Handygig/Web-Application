<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProviderController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Provider/Index');
    }

    public function kyc(Request $request): Response
    {
        return Inertia::render('Admin/Provider/Kyc');
    }

    public function banned(Request $request): Response
    {
        return Inertia::render('Admin/Provider/Banned');
    }
}
