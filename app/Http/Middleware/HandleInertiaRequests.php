<?php

namespace App\Http\Middleware;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = App::getLocale();
        $path = lang_path($locale.'.json');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? array_merge(
                    $request->user()->toArray(),
                    ['roles' => $request->user()->roles->map(fn ($r) => ['name' => $r->name])->values()]
                ) : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'locale' => $locale,
            'translations' => File::exists($path)
                ? json_decode(File::get($path), true)
                : [],
            'availableLocales' => [
                'en' => 'English',
                'si' => 'සිංහල',
                'ta' => 'தமிழ்',
            ],
            'sharedNotifications' => function () use ($request) {
                if (! $request->user()) {
                    return [];
                }

                return Notification::where('recipient_user_id', $request->user()->id)
                    ->orderBy('created_at', 'desc')
                    ->take(4)
                    ->get()
                    ->map(function ($n) use ($request) {
                        $isAdmin = $request->user()->role === 'admin';
                        $routePrefix = $isAdmin ? 'admin' : 'company';
                        $actionUrl = null;
                        if ($n->type === 'kyc') {
                            $actionUrl = $isAdmin ? route('admin.providers.kyc') : route('company.dashboard');
                        } elseif ($n->type === 'booking') {
                            $actionUrl = route($routePrefix . '.bookings.index');
                        } else {
                            $actionUrl = route($routePrefix . '.notifications.index');
                        }

                        return [
                            'id' => $n->id,
                            'title' => $n->title,
                            'desc' => $n->message,
                            'time' => $n->created_at ? $n->created_at->diffForHumans() : __('Recently'),
                            'unread' => ! $n->is_read,
                            'href' => $actionUrl,
                        ];
                    });
            },
            'unreadNotificationsCount' => function () use ($request) {
                return $request->user()
                    ? Notification::where('recipient_user_id', $request->user()->id)->where('is_read', false)->count()
                    : 0;
            },
        ];
    }
}
