"use client";

import * as React from "react";
import Image from "next/image";
import { format, addDays, isBefore, startOfDay, differenceInDays } from "date-fns";
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
    MapPin,
    Phone,
    Mail,
    Globe
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
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { Hotel } from "@/lib/types-hotel";
import Link from "next/link";

interface HotelBookingSidebarProps {
    hotel: Hotel;
}

type DateRange = {
    from: Date | undefined;
    to?: Date | undefined;
};

export function HotelBookingSidebar({ hotel }: HotelBookingSidebarProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

    const FormSchema = z.object({
        fullName: z.string().min(2, { message: "Моля въведете име" }),
        email: z.string().email({ message: "Невалиден имейл" }),
        phone: z.string().min(6, { message: "Невалиден телефон" }),
        guests: z.number().min(1, { message: "Поне 1 гост" }),
        dateRange: z.object({
            from: z.date({ message: "Моля изберете дата" }),
            to: z.date({ message: "Моля изберете крайна дата" }),
        }),
        message: z.string().optional(),
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
            message: ""
        },
    });

    const handleDateSelect = (range: DateRange | undefined) => {
        if (!range) {
            form.setValue("dateRange", { from: undefined, to: undefined } as any);
            return;
        }
        form.setValue("dateRange", range as any);
    };

    const handleGuestChange = (delta: number) => {
        const current = form.getValues("guests");
        const newVal = Math.max(current + delta, 1);
        form.setValue("guests", newVal);
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

            formData.append("access_key", accessKey);
            formData.append("full_name", data.fullName);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("guests", data.guests.toString());

            if (data.dateRange.from && data.dateRange.to) {
                formData.append("check_in", format(data.dateRange.from, "yyyy-MM-dd"));
                formData.append("check_out", format(data.dateRange.to, "yyyy-MM-dd"));
                const nights = differenceInDays(data.dateRange.to, data.dateRange.from);
                formData.append("nights", nights.toString());
            }

            if (data.message) {
                formData.append("message", data.message);
            }

            formData.append("hotel_id", hotel.id);
            formData.append("hotel_name", hotel.name);
            formData.append("destination", `${hotel.location.city}, ${hotel.location.country}`);

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

    if (isSuccess) {
        return (
            <Card className="sticky top-24 border-green-200 bg-green-50/50 shadow-lg animate-in fade-in-50">
                <CardContent className="py-6 text-center flex flex-col items-center">
                    <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
                    <h3 className="text-xl font-bold text-green-900">Успешно изпратено!</h3>
                    <p className="text-green-700 mt-2 text-base max-w-[260px]">
                        Благодарим за интереса към <strong>{hotel.name}</strong>
                    </p>
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

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${hotel.location.latitude},${hotel.location.longitude}`;

    return (
        <div className="sticky top-24 space-y-6">
            <Card className="border-0 shadow-xl ring-1 ring-slate-200 overflow-hidden bg-white">
                <CardHeader className="pb-4 relative">
                    <div className="absolute top-0 right-4 flex flex-col gap-2 items-end">
                        <Link
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-xs gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-primary transition-colors"
                            title="Виж на картата"
                        >
                            <MapPin className="h-3 w-3" />
                            Виж на картата
                        </Link>
                        {hotel.url && (
                            <Link
                                href={hotel.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-xs gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-primary transition-colors"
                                title="Уебсайт на хотела"
                            >
                                <Globe className="h-3 w-3" />
                                Уебсайт
                            </Link>
                        )}
                    </div>

                    <div className="pr-10">
                        <CardTitle className="text-xl font-bold text-slate-900 leading-tight">
                            {hotel.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                            {hotel.location.country_code && (
                                <div className="relative w-6 h-4 shadow-sm rounded-[2px] overflow-hidden shrink-0">
                                    <Image
                                        src={`https://flagcdn.com/${hotel.location.country_code.toLowerCase()}.svg`}
                                        alt={hotel.location.country}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <span className="font-medium">
                                {hotel.location.city}, {hotel.location.country}
                            </span>
                        </div>
                        <div className="mt-3 text-sm text-slate-500 flex flex-col gap-1">
                            <p>{hotel.location.address_1}</p>
                            {hotel.location.post_code && <p>{hotel.location.post_code} {hotel.location.city}</p>}
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
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-slate-100" onClick={() => handleGuestChange(1)}><Plus className="h-3 w-3" /></Button>
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
                                <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Имена</FormLabel><FormControl><Input placeholder="Вашето име" className="h-11 bg-slate-50/50 " {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="name@example.com" className="h-11 bg-slate-50/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Телефон</FormLabel><FormControl><Input placeholder="+359..." className="h-11 bg-slate-50/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="message" render={({ field }) => (<FormItem><FormLabel>Допълнителна Информация</FormLabel><FormControl><Textarea placeholder="Ако имате допълнителна информация за запитването ви, въведете я тук." className="bg-slate-50/50 min-h-[100px] " {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg transition-all hover:scale-[1.01]" disabled={isSubmitting}>
                                {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />Обработка...</>) : ("Изпрати Запитване")}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
