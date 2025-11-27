import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HolidayCardSkeleton() {
    return (
        <Card className="group flex flex-col h-full overflow-hidden pt-0 bg-secondary-foreground/30 relative">
            {/* Image Skeleton */}
            <div className="relative h-56 w-full bg-gray-200">
                <Skeleton className="h-full w-full" />
                {/* Country Flag Skeleton */}
                <div className="absolute bottom-2 left-2 border border-border/10 bg-white/50 rounded-xs">
                    <Skeleton className="h-6 w-8" />
                </div>
                {/* Transport Badge Skeleton */}
                <div className="absolute top-2 right-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            </div>

            <CardHeader className="space-y-2">
                {/* Title Skeleton */}
                <Skeleton className="h-7 w-3/4" />
                {/* Subtitle Skeleton */}
                <Skeleton className="h-4 w-full" />
            </CardHeader>

            <CardContent className="space-y-2 flex-grow">
                {/* Route Skeleton */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Duration Skeleton */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Date Skeleton */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </CardContent>

            <CardFooter className="justify-between pt-2">
                <div>
                    <Skeleton className="h-3 w-10 mb-1" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-10 w-28 rounded-md" />
            </CardFooter>
        </Card>
    );
}
