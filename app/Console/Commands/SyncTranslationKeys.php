<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SyncTranslationKeys extends Command
{
    protected $signature = 'translations:sync';

    protected $description = 'Scan project files and sync missing translation keys into JSON language files';

    public function handle(): int
    {
        $baseLocale = 'en';

        $targetLocales = [
            'si',
            'ta',
        ];

        $scanPaths = [
            app_path(),
            base_path('routes'),
            resource_path('views'),
            resource_path('js'),
        ];

        $scannedKeys = $this->scanTranslationKeys($scanPaths);

        $this->syncBaseLocale($baseLocale, $scannedKeys);

        $baseTranslations = $this->readJsonFile(lang_path($baseLocale.'.json'));

        $allBaseKeys = collect(array_keys($baseTranslations))
            ->filter()
            ->unique()
            ->sort()
            ->values();

        foreach ($targetLocales as $locale) {
            $this->syncTargetLocale($locale, $allBaseKeys);
        }

        $this->newLine();
        $this->info('Translation sync completed successfully.');
        $this->info('Scanned keys found: '.$scannedKeys->count());
        $this->info('Total English keys synced to other languages: '.$allBaseKeys->count());

        return self::SUCCESS;
    }

    private function scanTranslationKeys(array $scanPaths)
    {
        $files = collect();

        foreach ($scanPaths as $path) {
            if (File::exists($path)) {
                $files = $files->merge(File::allFiles($path));
            }
        }

        $keys = collect();

        foreach ($files as $file) {
            $extension = $file->getExtension();
            $filename = $file->getFilename();

            if (! $this->shouldScanFile($extension, $filename)) {
                continue;
            }

            $content = File::get($file->getPathname());

            $matches = $this->extractKeysFromContent($content);

            $keys = $keys->merge($matches);
        }

        return $keys
            ->map(fn ($key) => trim($key))
            ->filter(fn ($key) => $key !== '')
            ->reject(fn ($key) => str_contains($key, "\n"))
            ->reject(fn ($key) => str_contains($key, "\r"))
            ->reject(fn ($key) => preg_match('/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/', $key))
            ->unique()
            ->sort()
            ->values();
    }

    private function shouldScanFile(string $extension, string $filename): bool
    {
        if (str_ends_with($filename, '.blade.php')) {
            return true;
        }

        return in_array($extension, [
            'php',
            'js',
            'jsx',
            'ts',
            'tsx',
            'vue',
        ]);
    }

    private function extractKeysFromContent(string $content): array
    {
        $keys = [];

        $patterns = [
            // Laravel: __('Text here') or __("You're logged in!")
            "/__\(\s*(['\"])(.*?)\\1\s*[\),]/s",

            // Laravel: trans('Text here') or trans("You're logged in!")
            "/trans\(\s*(['\"])(.*?)\\1\s*[\),]/s",

            // React helper: t('Text here') or t("You're logged in!")
            "/\bt\(\s*(['\"])(.*?)\\1\s*[\),]/s",
        ];

        foreach ($patterns as $pattern) {
            preg_match_all($pattern, $content, $matches);

            if (! empty($matches[2])) {
                $keys = array_merge($keys, $matches[2]);
            }
        }

        return $keys;
    }

    private function syncBaseLocale(string $locale, $keys): void
    {
        $path = lang_path($locale.'.json');

        $translations = $this->readJsonFile($path);

        $added = 0;

        foreach ($keys as $key) {
            if (! array_key_exists($key, $translations)) {
                $translations[$key] = $key;
                $added++;
            }
        }

        ksort($translations);

        $this->writeJsonFile($path, $translations);

        $this->info("{$locale}.json updated. New keys added: {$added}");
    }

    private function syncTargetLocale(string $locale, $keys): void
    {
        $path = lang_path($locale.'.json');

        $translations = $this->readJsonFile($path);

        $added = 0;

        foreach ($keys as $key) {
            if (! array_key_exists($key, $translations)) {
                $translations[$key] = '';
                $added++;
            }
        }

        ksort($translations);

        $this->writeJsonFile($path, $translations);

        $this->info("{$locale}.json updated. New keys added: {$added}");
    }

    private function readJsonFile(string $path): array
    {
        if (! File::exists($path)) {
            return [];
        }

        $content = File::get($path);

        if (trim($content) === '') {
            return [];
        }

        $decoded = json_decode($content, true);

        if (! is_array($decoded)) {
            $this->warn("Invalid JSON detected in {$path}. File was treated as empty.");

            return [];
        }

        return $decoded;
    }

    private function writeJsonFile(string $path, array $translations): void
    {
        File::ensureDirectoryExists(dirname($path));

        File::put(
            $path,
            json_encode(
                $translations,
                JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
            ).PHP_EOL
        );
    }
}
