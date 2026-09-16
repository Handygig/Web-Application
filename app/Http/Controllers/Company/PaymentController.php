<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Resources\Company\CompanyPaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $payments = Payment::latest()->paginate(10)->withQueryString();

        return Inertia::render('Company/Payment/Index', [
            'payments' => CompanyPaymentResource::collection($payments),
        ]);
    }
}
