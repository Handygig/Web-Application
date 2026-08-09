<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Customer/Index');
    }

    public function show(int $customer): Response
    {
        return Inertia::render('Admin/Customer/Show', compact('customer'));
    }
}
