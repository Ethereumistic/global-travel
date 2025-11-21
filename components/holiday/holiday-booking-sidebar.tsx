"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
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
    Info,
    Euro
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { Holiday } from "@/lib/types-holiday";
import { ALL_COUNTRIES } from "@/lib/constants";

interface HolidayBookingSidebarProps {
    holiday: Holiday;
}

export function HolidayBookingSidebar({ holiday }: HolidayBookingSidebarProps) {
    const pathname = usePathname();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    // Determine country info
    const countryCode = holiday.country?.iso_code?.toLowerCase() || holiday.country?.country?.toLowerCase() || "bg";
    const countryName = holiday.country?.name || "Unknown";

    const FormSchema = z.object({
        fullName: z.string().min(2, { message: "Моля въведете име" }),
        email: z.string().email({ message: "Невалиден имейл" }),
        phone: z.string().min(6, { message: "Невалиден телефон" }),
        guests: z.number().min(1, { message: "Поне 1 гост" }),
        selectedTripId: z.string().min(1, { message: "Моля изберете дата" }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            guests: 2,
            selectedTripId: "",
        },
    });

    const selectedTripId = form.watch("selectedTripId");

    const selectedTrip = React.useMemo(() => {
        return holiday.trips?.find(t => t.trip_id === selectedTripId);
    }, [holiday.trips, selectedTripId]);

    const calculation = React.useMemo(() => {
        if (!selectedTrip) return null;
        const pricePerPerson = selectedTrip.total_price.main.value;
        const guests = form.getValues("guests");
        return {
            total: pricePerPerson * guests,
            perPerson: pricePerPerson,
            currency: selectedTrip.total_price.main.currency
        };
    }, [selectedTrip, form.watch("guests")]);

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

            formData.append("access_key", accessKey);
            formData.append("full_name", data.fullName);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("guests", data.guests.toString());

            if (selectedTrip) {
                formData.append("departure_date", selectedTrip.departure_date);
                formData.append("trip_id", selectedTrip.trip_id);
            }

            formData.append("holiday_id", holiday.id);
            formData.append("holiday_title", holiday.title);
            formData.append("destination", countryName);

            if (calculation) {
                formData.append("estimated_total", `${calculation.currency} ${calculation.total}`);
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
        const newVal = Math.max(current + delta, 1);
        form.setValue("guests", newVal);
    };

    if (isSuccess) {
        return (
            <Card className="sticky top-20 border-green-200 bg-green-50/50 shadow-lg animate-in fade-in-50">
                <CardContent className="py-6 text-center flex flex-col items-center">
                    <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
                    <h3 className="text-xl font-bold text-green-900">Успешно изпратено!</h3>
                    <p className="text-green-700 mt-2 text-base max-w-[260px]">
                        Благодарим за интереса към <strong>{holiday.title}</strong>
                    </p>

                    <div className="flex gap-2 items-center justify-center mt-4">
                        <div className="relative w-6 h-4 shadow-sm rounded-[2px] overflow-hidden shrink-0">
                            <Image src={`https://flagcdn.com/${countryCode}.svg`} alt={countryName} fill className="object-cover" />
                        </div>
                        <span className="text-base"><strong>{countryName}</strong></span>
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
        <div className="sticky top-24 space-y-6">
            <Card className="border-0 shadow-xl ring-1 ring-slate-200 overflow-hidden bg-white">
                <CardHeader className="pb-4">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900 leading-tight line-clamp-2">{holiday.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                            <div className="relative w-6 h-4 shadow-sm rounded-[2px] overflow-hidden shrink-0">
                                <Image src={`https://flagcdn.com/${countryCode}.svg`} alt={countryName} fill className="object-cover" />
                            </div>
                            <span className="font-medium">{countryName}</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {/* Trip Selection */}
                            <FormField
                                control={form.control}
                                name="selectedTripId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Изберете дата на отпътуване</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Изберете дата" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {holiday.trips?.map((trip) => (
                                                    <SelectItem key={trip.trip_id} value={trip.trip_id}>
                                                        {format(new Date(trip.departure_date), "dd MMM yyyy", { locale: bg })} - {trip.total_price.main.value} {trip.total_price.main.currency}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                        <div className="flex justify-between items-center mb-2">
                                            <FormLabel className="text-base font-medium">Гости</FormLabel>
                                        </div>
                                        <FormControl>
                                            <div className="flex items-center gap-3">
                                                <Button type="button" variant="outline" size="icon" className="h-11 w-11 shrink-0 border-slate-200" onClick={() => handleGuestChange(-1)} disabled={field.value <= 1}><Minus className="h-4 w-4" /></Button>
                                                <div className="flex-1"><Input {...field} type="number" className="text-center font-bold h-11 text-lg bg-white" onChange={(e) => form.setValue("guests", parseInt(e.target.value))} /></div>
                                                <Button type="button" variant="outline" size="icon" className="h-11 w-11 shrink-0 border-slate-200" onClick={() => handleGuestChange(1)}><Plus className="h-4 w-4" /></Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator className="my-2" />

                            {/* Contact Fields */}
                            <div className="space-y-3">
                                <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Имена</FormLabel><FormControl><Input placeholder="Вашето име" className="h-11 bg-slate-50/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="name@example.com" className="h-11 bg-slate-50/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Телефон</FormLabel><FormControl><Input placeholder="+359..." className="h-11 bg-slate-50/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>

                            {/* Price Display */}
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mt-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-sm text-slate-500 block mb-1">Обща цена:</span>
                                        {calculation && (<div className="text-xs text-slate-400 flex items-center gap-1"><Info className="h-3 w-3" />{form.getValues("guests")} x {calculation.perPerson} {calculation.currency}</div>)}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-primary tracking-tight block">{calculation ? `${calculation.total.toLocaleString()} ${calculation.currency}` : "—"}</span>
                                    </div>
                                </div>
                                {!calculation && (<p className="text-xs text-slate-400 mt-2 text-center">Изберете дата за цена</p>)}
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg transition-all hover:scale-[1.01]" disabled={isSubmitting}>
                                {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Обработка...</>) : ("Изпрати Запитване")}
                            </Button>

                            <p className="text-[10px] text-center text-slate-400">*Цената е ориентировъчна и подлежи на промени.</p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
