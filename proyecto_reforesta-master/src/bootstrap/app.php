<?php


use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // ESTO ES LO MÁS IMPORTANTE:
        // Fuerza a Laravel a responder en JSON para cualquier error si la URL empieza por /api
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });

        // Tu manejador de validación (el que ya te funciona)
        $exceptions->render(function (ValidationException $e, Request $request) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $e->errors(),
            ], 422);
        });

        // Manejador para Ruta no encontrada (404) o Método no permitido (405)
        // Usamos la clase base de Symfony para capturar ambos
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpExceptionInterface $e, Request $request) {
            if ($request->is('api/*')) {
                $statusCode = $e->getStatusCode();
                $message = $e->getMessage();

                if ($statusCode == 404) {
                    $message = $e->getMessage();
                } elseif ($statusCode == 405) {
                    $message = 'Método no permitido para esta ruta.';
                }

                return response()->json([
                    'status' => 'error',
                    'message' => $message
                ], $statusCode);
            }
        });

        // Error de Base de Datos
        $exceptions->render(function (QueryException $e, Request $request) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error de base de datos',
                'debug' => $e->getMessage()
            ], 500);
        });

    })->create();

