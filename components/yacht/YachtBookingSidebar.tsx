"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  format,
  addDays,
  isBefore,
  startOfDay,
  isWithinInterval,
  setYear,
  differenceInDays,
  differenceInCalendarDays
} from "date-fns";
import { bg } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CalendarIcon,
  Loader2,
  CheckCircle2,
  Minus,
  Plus,
  Info
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { Yacht } from "@/lib/types-yacht";
import { ALL_COUNTRIES } from "@/lib/constants";

// --- Type Definition ---
type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

// --- COUNTRY RESOLVER ---
function resolveCountry(apiCountry: string | undefined, urlParamCountry: string | undefined) {
  let targetCode = urlParamCountry?.trim().toLowerCase();

  if (!targetCode && apiCountry) {
    targetCode = apiCountry.trim().toLowerCase();
  }
  if (!targetCode) targetCode = "gr";

  const found = ALL_COUNTRIES.find(c => c.abbr === targetCode);
  return found || { name: "Гърция", abbr: "gr", continent: "Европа" };
}

// --- PRICING LOGIC ---
const normalizeDate = (date: Date) => setYear(date, 2024);

const getDailyPriceForDate = (targetDate: Date, prices: Yacht['prices']) => {
  if (!prices || prices.length === 0) return 0;
  const normalizedTarget = normalizeDate(targetDate);

  const activeSeason = prices.find(season => {
    const sFrom = normalizeDate(new Date(season.from_date));
    const sTo = normalizeDate(new Date(season.to_date));
    return isWithinInterval(normalizedTarget, { start: sFrom, end: sTo });
  });

  return activeSeason ? activeSeason.price / 7 : 0;
};

interface YachtBookingSidebarProps {
  yacht: Yacht;
  externalCountryCode?: string;
}

export function YachtBookingSidebar({ yacht, externalCountryCode }: YachtBookingSidebarProps) {
  const pathname = usePathname(); // <--- Get current path
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const countryData = resolveCountry(yacht.country, externalCountryCode);

  const FormSchema = z.object({
    fullName: z.string().min(2, { message: "Моля въведете име" }),
    email: z.string().email({ message: "Невалиден имейл" }),
    phone: z.string().min(6, { message: "Невалиден телефон" }),
    guests: z.number().min(1).max(parseInt(yacht.guests) || 12),
    dateRange: z.object({
      from: z.date(),
      to: z.date(),
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      guests: 2,
      dateRange: {
        from: undefined,
        to: undefined
      } as any,
    },
  });

  const dateRange = form.watch("dateRange");

  const calculation = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return null;
    const start = startOfDay(dateRange.from);
    const end = startOfDay(dateRange.to);
    const daysCount = differenceInDays(end, start);
    if (daysCount <= 0) return null;

    let totalCost = 0;
    for (let i = 0; i < daysCount; i++) {
      const currentDay = addDays(start, i);
      const dailyRate = getDailyPriceForDate(currentDay, yacht.prices);
      const effectiveRate = dailyRate > 0 ? dailyRate : (yacht.min_price?.value || 0) / 7;
      totalCost += effectiveRate;
    }

    return {
      total: Math.ceil(totalCost),
      days: daysCount,
      avgDaily: Math.ceil(totalCost / daysCount)
    };
  }, [dateRange, yacht.prices, yacht.min_price]);

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range) {
      form.setValue("dateRange", { from: undefined, to: undefined } as any);
      return;
    }
    form.setValue("dateRange", range as any);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

      if (!accessKey) {
        toast.error("System Configuration Error");
        setIsSubmitting(false);
        return;
      }

      // --- FIX: Extract ID from URL if yacht.id is missing ---
      let yachtId = yacht.id;
      if (!yachtId || yachtId === "unknown") {
        // Example pathname: /bg/yachts/06eb0402-88d4-4997-af58-c952478e3d96
        // We split by '/yachts/' and take the second part
        const parts = pathname?.split("/yachts/");
        if (parts && parts.length > 1) {
          // In case there's a trailing slash, split by / again and take the first part
          yachtId = parts[1].split("/")[0];
        }
      }

      formData.append("access_key", accessKey);
      formData.append("full_name", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("guests", data.guests.toString());
      formData.append("check_in", format(data.dateRange.from, "yyyy-MM-dd"));
      formData.append("check_out", format(data.dateRange.to, "yyyy-MM-dd"));

      // Send the extracted ID, fallback to 'unknown' if parsing fails
      formData.append("yacht_id", yachtId || "unknown");

      formData.append("yacht_name", yacht.name);
      formData.append("destination", `${yacht.home_port}, ${countryData.name}`);

      if (calculation) {
        formData.append("estimated_total", `€${calculation.total}`);
        formData.append("duration_days", calculation.days.toString());
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        toast.success("Запитването е изпратено!");
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Възникна грешка");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGuestChange = (delta: number) => {
    const current = form.getValues("guests");
    const max = parseInt(yacht.guests) || 12;
    const newVal = Math.min(Math.max(current + delta, 1), max);
    form.setValue("guests", newVal);
  };

  if (isSuccess) {
    return (
      <Card className="sticky top-22 border-green-200 bg-green-50/50 shadow-lg animate-in fade-in-50">
        <CardContent className="py-6 text-center flex flex-col items-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
          <h3 className="text-xl font-bold text-green-900">Успешно изпратено!</h3>
          <p className="text-green-700 mt-2 text-base max-w-[260px]">
            Благодарим за интереса към <strong>{yacht.name}</strong> в
          </p>

          <div className="flex gap-2 items-center justify-center">
            <div className="relative w-6 h-4 shadow-sm rounded-[2px] overflow-hidden shrink-0">
              <Image src={`https://flagcdn.com/${countryData.abbr}.svg`} alt={countryData.name} fill className="object-cover" />
            </div>
            <span className="text-base"><strong>{countryData.name}</strong>, {yacht.home_port}</span>
          </div>
          <p className="mt-8 text-green-700">
            Наш агент ще се свърже с Вас в най-скоро време!
          </p>

          <Button variant="outline" className="mt-6 border-green-600 text-green-700 hover:bg-green-500/10" onClick={() => setIsSuccess(false)}>
            OK
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="sticky top-22 space-y-6">
      <Card className="border-0 shadow-xl ring-1 ring-slate-200 overflow-hidden bg-white">
        <CardHeader className=" ">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">{yacht.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
              <div className="relative w-6 h-4 shadow-sm rounded-[2px] overflow-hidden shrink-0">
                <Image src={`https://flagcdn.com/${countryData.abbr}.svg`} alt={countryData.name} fill className="object-cover" />
              </div>
              <span className="font-medium">{countryData.name}, {yacht.home_port}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <div className="grid grid-cols-2 gap-3">
                {/* Date Picker */}
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs uppercase text-slate-500 font-bold">Период</FormLabel>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal h-10 border-slate-200 hover:bg-slate-50 text-xs",
                                !field.value?.from && "text-muted-foreground"
                              )}
                            >
                              {field.value?.from ? (
                                field.value.to ? (
                                  <div className="flex flex-col leading-tight">
                                    <span className="font-semibold text-slate-700">{format(field.value.from, "dd.MM", { locale: bg })}</span>
                                    <span className="text-slate-400 text-[10px]">до {format(field.value.to, "dd.MM", { locale: bg })}</span>
                                  </div>
                                ) : (format(field.value.from, "dd MMM", { locale: bg }))
                              ) : (<span className="flex items-center gap-1 truncate"><CalendarIcon className="h-3 w-3 opacity-50" />Дати</span>)}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={handleDateSelect}
                            numberOfMonths={1}
                            disabled={(date) => isBefore(date, startOfDay(new Date()))}
                            initialFocus
                            locale={bg}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Guests */}
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase text-slate-500 font-bold">Гости</FormLabel>
                      <FormControl>
                        <div className="flex items-center h-10 border rounded-md px-1 border-slate-200">
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-slate-100" onClick={() => handleGuestChange(-1)} disabled={field.value <= 1}><Minus className="h-3 w-3" /></Button>
                          <div className="flex-1 text-center font-bold text-sm">{field.value}</div>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-slate-100" onClick={() => handleGuestChange(1)} disabled={field.value >= (parseInt(yacht.guests) || 12)}><Plus className="h-3 w-3" /></Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-2" />

              {/* Contact Fields */}
              <div className="space-y-3">
                <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Имена</FormLabel><FormControl><Input placeholder="Вашето име" className="h-11 bg-slate-50/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="name@example.com" className="h-11 bg-slate-50/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Телефон</FormLabel><FormControl><Input placeholder="+359..." className="h-11 bg-slate-50/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              {/* Price Display */}
              <div className=" rounded-xl p-5 text-black mt-4 shadow-inner">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm text-black block mb-1">Обща цена:</span>
                    {calculation && (<div className="text-xs text-black flex items-center gap-1"><Info className="h-3 w-3" />{calculation.days} дни x ~€{calculation.avgDaily}/ден</div>)}
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-blue-600  tracking-tight block">{calculation ? `€${calculation.total.toLocaleString()}` : "—"}</span>
                  </div>
                </div>
                {!calculation && (<p className="text-xs text-black mt-2 text-center border-t border-slate-800 pt-2">Изберете дати за калкулация</p>)}
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg transition-all hover:scale-[1.01]" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Обработка...</>) : ("Изпрати Запитване")}
              </Button>

              <p className="text-[10px] text-center text-slate-400">*Цената е ориентировъчна и подлежи на потвърждение.</p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}