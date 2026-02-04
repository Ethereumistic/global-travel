'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an analytics service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-8">
            <div className="relative">
                <div className="absolute -inset-4 bg-red-100 rounded-full blur-xl opacity-50 dark:bg-red-900/30"></div>
                <AlertTriangle className="relative w-24 h-24 text-red-600 dark:text-red-400" />
            </div>

            <div className="space-y-4 max-w-md">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Възникна грешка!
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Нещо се обърка при зареждането на тази страница. Моля опитайте отново.
                </p>
            </div>

            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                size="lg"
                className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
                <RefreshCcw className="w-4 h-4" />
                Опитай отново
            </Button>
        </div>
    )
}
