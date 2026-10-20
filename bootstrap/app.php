<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            SetLocale::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => __('Validation failed'), 'errors' => $e->validator->getMessageBag()], 422);
            }
        });

        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => __('You are not authorized to perform this action.'),
                ], 403);
            }
        });

        $exceptions->report(function (Throwable $exception) {
            if (str_contains($exception->getMessage(), 'SQLSTATE[HY000] [2002]')) {
                // Send email to admin once every 5 minutes
                $lastReported = cache()->get('db_connection_error_last_reported', 0);
                if (! $lastReported || time() - intval($lastReported) > 300) {
                    Mail::to('deshanfdo27@gmail.com')->send(new ExceptionOccurred($exception));
                    cache()->put('db_connection_error_last_reported', time(), 300);
                }

                return false;
            }

            /**
             * laravel-responsecache correctly handles a race condition when the cached response is cleared or expired
             * between calling 'hasBeenCached' and 'getCachedResponseFor'. However, it still does report when this happens.
             * Because everything continues to work in this situation, and there is no bug, we are ignoring this message.
             *
             * See https://github.com/spatie/laravel-responsecache/pull/434.
             */
            if ($exception->getMessage() === 'Could not unserialize response, returning uncached response instead. Error: Could not unserialize serialized response ``') {
                return false;
            }

            // Send email to admin if the exception is not ignored
            if (config('app.env') === 'production') {
                // Avoid sending too many emails in a short time about same exception
                $lastExceptionReported = cache()->get('exception_last_reported_'.md5($exception->getMessage()), 0);
                if (! $lastExceptionReported || time() - intval($lastExceptionReported) > 300) {
                    cache()->put('exception_last_reported_'.md5($exception->getMessage()), time(), 300);
                    Mail::to('deshanfdo27@gmail.com')->send(new ExceptionOccurred($exception));
                }
            }
        });
    })->create();
