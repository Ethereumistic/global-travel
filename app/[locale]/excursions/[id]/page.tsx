"use client"

import * as React from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  Plane,
  Clock,
  Hotel,
  ChevronLeft,
  ExternalLink,
  Utensils,
  AlertCircle,
  Check,
  ArrowRight,
  Compass,
  Trophy,
  PlaneTakeoff, // Added
  PlaneLanding, // Added
  Bus, // Added
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { PackageDetail } from "@/app/api/packages/[id]/route"

export default function ExcursionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [packageDetail, setPackageDetail] = React.useState<PackageDetail | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [mainCarouselApi, setMainCarouselApi] = React.useState<CarouselApi>()
  const [galleryCarouselApi, setGalleryCarouselApi] = React.useState<CarouselApi>()
  const [mainImageIndex, setMainImageIndex] = React.useState(0)
  const [galleryImageIndex, setGalleryImageIndex] = React.useState(0)

  React.useEffect(() => {
    if (!mainCarouselApi) return
    mainCarouselApi.on("select", () => {
      setMainImageIndex(mainCarouselApi.selectedScrollSnap())
    })
  }, [mainCarouselApi])

  React.useEffect(() => {
    if (!galleryCarouselApi) return
    galleryCarouselApi.on("select", () => {
      setGalleryImageIndex(galleryCarouselApi.selectedScrollSnap())
    })
  }, [galleryCarouselApi])

  React.useEffect(() => {
    async function fetchPackageDetail() {
      if (!id) {
        setError("Invalid Page ID")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/packages/${id}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Неуспешно зареждане на екскурзията")
        }

        const data = await response.json()
        setPackageDetail(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Възникна грешка")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackageDetail()
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-96 w-full mb-6 rounded-xl" />
        <Skeleton className="h-12 w-34 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-56" />
      </div>
    )
  }

  if (error || !packageDetail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Грешка</AlertTitle>
          <AlertDescription>{error || "Екскурзията не беше намерена"}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/excursions">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Обратно към екскурзии
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 min-h-screen">
      <div className="mx-auto px-4 py-6">
        <Button asChild variant="ghost" className="mb-6 hover:bg-primary/10">
          <Link href="/excursions">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Обратно
          </Link>
        </Button>
      </div>

      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">{packageDetail.title}</h1>

        {packageDetail.images.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-6">
            
            {/* Main carousel (left) - Added 'relative' for absolute positioning of the badge */}
            <div className="lg:col-span-1 relative"> 
              <Carousel setApi={setMainCarouselApi} className="w-full">
                <CarouselContent>
                  {packageDetail.images.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative w-full aspect-square rounded-l-xl overflow-hidden shadow-lg">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`${packageDetail.title} ${idx + 1}`}
                          fill
                          className="object-cover"
                          priority={idx === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
                {packageDetail.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge variant="secondary">
                    {mainImageIndex + 1} / {packageDetail.images.length}
                  </Badge>
                </div>
              )}
              </Carousel>
              
              {/* Image counter badge: Now absolutely positioned at the bottom center */}

            </div>

            {/* 2x2 Image grid (right) - Retained the h-full fix from the previous step */}
            <div className="grid grid-cols-2 gap-2 h-full">
              {packageDetail.images.slice(1, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => mainCarouselApi?.scrollTo(idx + 1)}
                  className={`relative w-full aspect-square overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-shadow ${
                    idx === 1
                      ? "rounded-tr-xl" // Top-right image
                      : idx === 3
                      ? "rounded-br-xl" // Bottom-right image
                      : "" // Default for top-left (idx 0) and bottom-left (idx 2)
                  }`}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${packageDetail.title} ${idx + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Left: 4 Icons in compact cards */}
          <div className="lg:col-span-1">
          
          {/* --- MODIFIED SECTION START --- */}
          {packageDetail.cities.length > 0 && (
              <Card className="border-0 shadow-sm mb-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Посещавани места
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center overflow-x-auto py-4">
                    {(() => {
                      const isPlane =
                        packageDetail.transport === "Самолет" ||
                        packageDetail.transport === "Директен полет";
                      const isBus = packageDetail.transport === "Автобус";
                      const showIcons = isPlane || isBus;

                      return (
                        <div className="flex items-center">
                          {/* 1. Start Icon */}
                          {isPlane && (
                            <PlaneTakeoff className="h-5 w-5 text-primary flex-shrink-0 mx-2" />
                          )}
                          {isBus && (
                            <Bus className="h-5 w-5 text-primary flex-shrink-0 mx-2" />
                          )}

                          {/* 2. Map cities with connecting lines */}
                          {packageDetail.cities.map((city, idx) => (
                            <React.Fragment key={city.id}>
                              {/* 3. Render connecting line *before* all items except the first */}
                              {idx > 0 && (
                                <div className="flex-1 h-px bg-gray-300 min-w-[20px]" />
                              )}

                              {/* 4. Render line *before* first city *if* icons are shown */}
                              {idx === 0 && showIcons && (
                                <div className="flex-1 h-px bg-gray-300 min-w-[20px]" />
                              )}

                              {/* 5. City Badge */}
                              <Badge
                                variant="secondary"
                                className="text-sm py-2 px-4 whitespace-nowrap"
                              >
                                {city.name}
                              </Badge>
                            </React.Fragment>
                          ))}

                          {/* 6. Render line *after* last city *if* icons are shown */}
                          {showIcons && packageDetail.cities.length > 0 && (
                            <div className="flex-1 h-px bg-gray-300 min-w-[20px]" />
                          )}

                          {/* 7. End Icon */}
                          {isPlane && (
                            <PlaneLanding className="h-5 w-5 text-primary flex-shrink-0 mx-2" />
                          )}
                          {isBus && (
                            <Bus className="h-5 w-5 text-primary flex-shrink-0 mx-2" />
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* --- MODIFIED SECTION END --- */}

            <div className="grid grid-cols-3 gap-3">
              {/* Time Period */}
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="flex justify-center items-center gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Период на пътуване</p>
                    <p className="text-sm font-semibold text-nowrap">
                      {new Date(packageDetail.period.from).toLocaleDateString("bg-BG")} -{" "}
                      {new Date(packageDetail.period.to).toLocaleDateString("bg-BG")}
                    </p>
                    </div>
                </div>
                </CardContent>
              </Card>

              {/* Duration */}
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground mb-1">Продължителност</p>
                  <p className="text-lg font-bold">{packageDetail.duration} дни</p>
                </CardContent>
              </Card>

              {/* Destination */}
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground mb-1">Дестинации</p>
                  <p className="text-xs font-bold line-clamp-1">
                    {packageDetail.countries.map((c) => c.name).join(", ")}
                  </p>
                </CardContent>
              </Card>

              {/* Transport */}
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Plane className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground mb-1">Транспорт</p>
                  <p className="text-xs font-bold line-clamp-1">{packageDetail.transport}</p>
                </CardContent>
              </Card>

              {/* Price */}
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground mb-1">Цена от</p>
                  <p className="text-lg font-bold text-primary">{packageDetail.minPrice.price}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right: Overview + Dates + Price */}
          <div className="lg:col-span-1 space-y-4">
            {/* Overview */}
            {packageDetail.overview && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Compass className="h-5 w-5 text-primary" />
                    Преглед
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{packageDetail.overview}</p>
                </CardContent>
              </Card>
            )}

            {/* Travel Dates */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Период на пътуване</p>
                    <p className="text-sm font-semibold">
                      {new Date(packageDetail.period.from).toLocaleDateString("bg-BG")} -{" "}
                      {new Date(packageDetail.period.to).toLocaleDateString("bg-BG")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Note */}
            {packageDetail.minPrice.priceNote && (
              <Card className="border-0 shadow-sm bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50">
                <CardContent className="p-4">
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold mb-1 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Включено в цената
                  </p>
                  <p className="text-xs text-foreground/80 line-clamp-4">{packageDetail.minPrice.priceNote}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="overview">Преглед</TabsTrigger>
            <TabsTrigger value="schedule">Програма</TabsTrigger>
            <TabsTrigger value="hotels">Хотели</TabsTrigger>
            <TabsTrigger value="additional">Допълнително</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {packageDetail.overview && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-primary" />
                    За пакета
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{packageDetail.overview}</p>
                </CardContent>
              </Card>
            )}

            {packageDetail.minPrice.priceNote && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    Включено в цената
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {packageDetail.minPrice.priceNote
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80">{line.trim()}</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {packageDetail.priceNote2 && (
              <Card className="border-0 shadow-sm bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    Важна информация
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {packageDetail.priceNote2
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, idx) => (
                        <p key={idx} className="text-sm text-foreground/80 leading-relaxed">
                          {line.trim()}
                        </p>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}


          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {packageDetail.dailySchedule.map((day, idx) => (
                <Card key={day.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm flex-shrink-0">
                        {idx + 1}
                      </div>
                      <CardTitle className="text-lg">{day.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line">{day.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6">
            {packageDetail.hotels.map((hotel) => {
              return <HotelCard key={hotel.id} hotel={hotel} />
            })}
          </TabsContent>

          <TabsContent value="additional" className="space-y-6">
            {/* Additional Payments - Multi-column layout */}
            {packageDetail.additionalPayments.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Допълнителни плащания
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {packageDetail.additionalPayments.map((payment, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <span className="text-sm font-medium">{payment.title}</span>
                        <span className="font-semibold text-primary">
                          {payment.price} {payment.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Excursions - 3 columns */}
            {packageDetail.additionalExcursions.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Допълнителни екскурзии</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packageDetail.additionalExcursions.map((excursion) => (
                    <Card
                      key={excursion.id}
                      className="border-0 shadow-sm overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
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
                        {excursion.overview && <p className="text-sm text-foreground/80">{excursion.overview}</p>}
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

            {/* Gallery with Carousel + Grid */}
            {packageDetail.images.length > 1 && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Галерия</h3>

                {/* Main carousel (16:9) */}
                <div className="mb-6">
                  <Carousel setApi={setGalleryCarouselApi} className="w-full">
                    <CarouselContent>
                      {packageDetail.images.map((img, idx) => (
                        <CarouselItem key={idx}>
                          <div
                            className="relative w-full rounded-lg overflow-hidden shadow-lg"
                            style={{ aspectRatio: "16 / 9" }}
                          >
                            <Image
                              src={img || "/placeholder.svg"}
                              alt={`${packageDetail.title} gallery ${idx + 1}`}
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
                  {packageDetail.images.length > 1 && (
                    <div className="text-center mt-3">
                      <Badge variant="secondary">
                        {galleryImageIndex + 1} / {packageDetail.images.length}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* 6-column grid (1:1 aspect ratio) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {packageDetail.images.map((img, idx) => (
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
                        alt={`${packageDetail.title} ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Premium CTA Section */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-3xl font-bold mb-2">Готови за незабравимо пътешествие?</h3>
                <p className="text-primary-foreground/90 text-lg">
                  Свържете се с нас днес и резервирайте вашата екскурзия
                </p>
              </div>
              <Button size="lg" variant="secondary" className="whitespace-nowrap">
                Резервирай сега
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Separate Hotel Card Component
function HotelCard({ hotel }: { hotel: any }) {
  const [hotelCarouselApi, setHotelCarouselApi] = React.useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (!hotelCarouselApi) return
    hotelCarouselApi.on("select", () => {
      setCurrentIndex(hotelCarouselApi.selectedScrollSnap())
    })
  }, [hotelCarouselApi])

  return (
    <Card className="border-0 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Hotel Images Carousel */}
        {hotel.images.length > 0 && (
          <div className="flex flex-col gap-3">
            {/* Main carousel image - Square */}
            <Carousel setApi={setHotelCarouselApi} className="w-full">
              <CarouselContent>
                {hotel.images.map((img: string, idx: number) => (
                  <CarouselItem key={idx}>
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md">
                      <Image src={img || "/placeholder.svg"} alt={`${hotel.name} ${idx + 1}`} fill className="object-cover" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>

            {/* Counter badge */}
            {hotel.images.length > 1 && (
              <div className="text-center">
                <Badge variant="secondary">
                  {currentIndex + 1} / {hotel.images.length}
                </Badge>
              </div>
            )}

            {/* Thumbnail gallery */}
            {hotel.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {hotel.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => hotelCarouselApi?.scrollTo(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                      currentIndex === idx ? "border-primary shadow-md" : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${hotel.name} ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hotel Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <CardTitle className="flex items-center gap-2 text-2xl mb-2">
              <Hotel className="h-6 w-6 text-primary" />
              {hotel.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {hotel.city}, {hotel.country}
            </p>
          </div>

          {hotel.board && (
            <Badge variant="secondary" className="mb-4 w-fit">
              <Utensils className="h-3 w-3 mr-1" />
              {hotel.board}
            </Badge>
          )}

          {hotel.overview && <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{hotel.overview}</p>}

          {hotel.minPriceInDouble && (
            <div className="bg-primary/5 rounded-lg p-4 mb-4">
              <p className="text-xs text-muted-foreground">Минимална цена за двойна стая</p>
              <p className="text-2xl font-bold text-primary">
                {hotel.minPriceInDouble} {hotel.currency || "BGN"}
              </p>
            </div>
          )}

          {hotel.website && (
            <Button variant="outline" size="sm" asChild className="w-fit bg-transparent">
              <a href={hotel.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Посети сайта
              </a>
            </Button>
          )}

          {hotel.details && (
            <details className="group mt-4 pt-4 border-t">
              <summary className="cursor-pointer text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-2">
                Покажи детайли <ArrowRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-sm text-foreground/80 mt-3 whitespace-pre-line">{hotel.details}</p>
            </details>
          )}
        </div>
      </div>
    </Card>
  )
}