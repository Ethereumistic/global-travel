"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AlertCircle, ArrowRight } from "lucide-react";

interface AdditionalTabProps {
  additionalPayments: Array<{
    title: string;
    price: string;
    currency: string;
  }>;
  additionalExcursions: Array<{
    id: string;
    title: string;
    subtitle?: string;
    images: string[];
    overview?: string;
    details?: string;
    price?: string;
  }>;
  images: string[];
  packageTitle: string;
}

export function AdditionalTab({
  additionalPayments,
  additionalExcursions,
  images,
  packageTitle,
}: AdditionalTabProps) {
  const [galleryCarouselApi, setGalleryCarouselApi] = React.useState<CarouselApi>();
  const [galleryImageIndex, setGalleryImageIndex] = React.useState(0);

  React.useEffect(() => {
    if (!galleryCarouselApi) return;
    galleryCarouselApi.on("select", () => {
      setGalleryImageIndex(galleryCarouselApi.selectedScrollSnap());
    });
  }, [galleryCarouselApi]);

  // **FIX: De-duplicate the additionalPayments array**
  const uniqueAdditionalPayments = React.useMemo(() => {
    const seen = new Set<string>();
    return additionalPayments.filter(payment => {
      // 1. Normalize the title:
      //    - Trim whitespace from ends.
      //    - Replace multiple spaces (or non-breaking spaces) with a single space.
      const normalizedTitle = payment.title
        .trim()
        .replace(/\s+/g, ' ');

      // 2. Create a unique key. We use || '' for currency in case it's null/undefined.
      const key = `${normalizedTitle}|${payment.price}|${payment.currency || ''}`;

      // 3. Check if we've seen this key
      if (seen.has(key)) {
        return false; // It's a duplicate, filter it out
      } else {
        seen.add(key);
        return true; // It's unique, keep it
      }
    });
  }, [additionalPayments]);
  // **END OF FIX**

  return (
    <div className="space-y-6">
      {/* **MODIFIED:** Use the new 'uniqueAdditionalPayments' array here */}
      {uniqueAdditionalPayments.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Допълнителни плащания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* **MODIFIED:** Map over the new 'uniqueAdditionalPayments' array */}
              {uniqueAdditionalPayments.map((payment, idx) => (
                <div
                  key={idx} // Using index is fine here as the list is stable after filter
                  className="flex justify-between items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  {/* Also trim the final output title just to remove any
                    trailing spaces from the display.
                  */}
                  <span className="text-sm font-medium">{payment.title.trim()}</span>
                  <span className="font-semibold text-primary">
                    {payment.price} {payment.currency}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* The rest of the component remains the same */}
      {additionalExcursions.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Допълнителни екскурзии</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalExcursions.map((excursion) => (
              <Card
                key={excursion.id}
                className="border-0 shadow-sm overflow-hidden hover:shadow-lg transition-shadow flex flex-col pt-0"
              >
                {excursion.images.length > 0 && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={excursion.images[0] || "/placeholder.svg"}
                      alt={excursion.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{excursion.title}</CardTitle>
                      {excursion.subtitle && (
                        <p className="text-xs text-muted-foreground mt-1">{excursion.subtitle}</p>
                      )}
                    </div>
                    {excursion.price && (
                      <Badge variant="default" className="whitespace-nowrap">
                        {excursion.price}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  {excursion.overview && (
                    <p className="text-sm text-foreground/80">{excursion.overview}</p>
                  )}
                  {excursion.details && (
                    <details className="group mt-auto">
                      <summary className="cursor-pointer text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-2">
                        Покажи детайли{" "}
                        <ArrowRight className="h-3 w-3 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="text-xs text-foreground/80 mt-2 whitespace-pre-wrap">
                        {excursion.details}
                      </div>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* {images.length > 1 && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Галерия</h3>
          <div className="mb-6">
            <Carousel setApi={setGalleryCarouselApi} className="w-full">
              <CarouselContent>
                {images.map((img, idx) => (
                  <CarouselItem key={idx}>
                    <div
                      className="relative w-full rounded-lg overflow-hidden shadow-lg"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${packageTitle} gallery ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
            {images.length > 1 && (
              <div className="text-center mt-3">
                <Badge variant="secondary">
                  {galleryImageIndex + 1} / {images.length}
                </Badge>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => galleryCarouselApi?.scrollTo(idx)}
                className={`relative rounded-lg overflow-hidden group cursor-pointer transition-all ${
                  galleryImageIndex === idx ? "ring-2 ring-primary shadow-lg" : "hover:shadow-lg"
                }`}
                style={{ aspectRatio: "1 / 1" }}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${packageTitle} ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}