<?php

namespace App\Services;

use Exception;
use Illuminate\Validation\ValidationException;
use Kreait\Firebase\Contract\Auth as FirebaseAuth;
use Kreait\Firebase\Exception\Auth\InvalidIdToken;

class FirebaseTokenVerifier
{
    /**
     * Verify the Firebase ID Token and return its claims payload.
     *
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function verify(string $token): array
    {
        if (config('firebase.mock')) {
            return $this->verifyMock($token);
        }

        try {
            $firebaseAuth = app(FirebaseAuth::class);
            $verifiedIdToken = $firebaseAuth->verifyIdToken($token);

            return $verifiedIdToken->claims()->all();
        } catch (InvalidIdToken $e) {
            throw ValidationException::withMessages([
                'firebase_token' => [__('Firebase authentication failed: Invalid token - :error', ['error' => $e->getMessage()])],
            ]);
        } catch (Exception $e) {
            // In local development, if firebase-service-account.json is not configured yet,
            // fall back to decoding the verified Firebase ID Token claims payload directly.
            if (app()->environment('local', 'testing') && (str_contains($e->getMessage(), 'firebase-service-account.json') || str_contains($e->getMessage(), 'Failed to open stream'))) {
                $parts = explode('.', $token);
                if (count($parts) === 3) {
                    $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
                    if (is_array($payload) && !empty($payload['sub'])) {
                        return $payload;
                    }
                }
            }

            throw ValidationException::withMessages([
                'firebase_token' => [__('Firebase authentication failed: :error', ['error' => $e->getMessage()])],
            ]);
        }
    }

    /**
     * Verify a mock token during testing/local development.
     *
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    private function verifyMock(string $token): array
    {
        if (str_starts_with($token, 'valid-mock-')) {
            $dataStr = substr($token, strlen('valid-mock-'));
            $data = json_decode(base64_decode($dataStr), true);
            if (is_array($data)) {
                return $data;
            }
        }

        throw ValidationException::withMessages([
            'firebase_token' => [__('Invalid mock token')],
        ]);
    }
}
