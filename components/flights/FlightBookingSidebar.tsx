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
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ALL_COUNTRIES } from "@/lib/constants";
import { SanityFlight } from "./flights-browser";

// --- Helper to find country ---
function getCountryData(countryName: string | undefined) {
    if (!countryName) return { name: "Unknown", abbr: "un" };

    const country = ALL_COUNTRIES.find(c =>
        c.name.toLowerCase() === countryName.toLowerCase() ||
        c.name_en.toLowerCase() === countryName.toLowerCase()
    );

    return country || { name: countryName, abbr: "un" };
}

interface FlightBookingSidebarProps {
    flight: SanityFlight;
}

export function FlightBookingSidebar({ flight }: FlightBookingSidebarProps) {
    const pathname = usePathname();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

    const toCountryData = getCountryData(flight.toCountry);

    const FormSchema = z.object({
        fullName: z.string().min(2, { message: "Моля въведете име" }),
        email: z.string().email({ message: "Невалиден имейл" }),
        phone: z.string().min(6, { message: "Невалиден телефон" }),
        passengers: z.number().min(1).max(10), // Arbitrary max for now
        date: z.date({ message: "Моля изберете дата" }),
        message: z.string().optional(),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            passengers: 1,
            date: undefined,
            message: "",
        },
    });

    const selectedDate = form.watch("date");
    const passengers = form.watch("passengers");

    // Simple price calculation (just multiplying base price by passengers)
    const calculation = React.useMemo(() => {
        if (!flight.price) return null;
        return {
            total: flight.price * passengers,
            perPerson: flight.price
        };
    }, [flight.price, passengers]);

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
            formData.append("passengers", data.passengers.toString());
            formData.append("travel_date", format(data.date, "yyyy-MM-dd"));

            formData.append("flight_id", flight._id || "unknown");
            formData.append("flight_route", `${flight.fromCity || 'Any'} -> ${flight.toCity}`);

            if (data.message) {
                formData.append("message", data.message);
            }

            if (calculation) {
                formData.append("estimated_total", `€${calculation.total}`);
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

    const handlePassengerChange = (delta: number) => {
        const current = form.getValues("passengers");
        const newVal = Math.min(Math.max(current + delta, 1), 10);
        form.setValue("passengers", newVal);
    };

    if (isSuccess) {
        return (
            <Card className="sticky top-22 border-green-200 bg-green-50/50 shadow-lg animate-in fade-in-50">
                <CardContent className="py-6 text-center flex flex-col items-center">
                    <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
                    <h3 className="text-xl font-bold text-green-900">Успешно изпратено!</h3>
                    <p className="text-green-700 mt-2 text-base max-w-[260px]">
                        Благодарим за интереса към полет до <strong>{flight.toCity}</strong>
                    </p>

                    <div className="flex gap-2 items-center justify-center mt-4">
                        <div className="relative w-6 h-4 shadow-sm rounded-[2px] overflow-hidden shrink-0">
                            <Image src={`https://flagcdn.com/${toCountryData.abbr}.svg`} alt={toCountryData.name} fill className="object-cover" />
                        </div>
                        <span className="text-base"><strong>{flight.toCity}</strong>, {toCountryData.name}</span>
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
                <CardHeader>
                    <div>
                        <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">Резервирай Полет</CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                            <span>До: </span>
                            <div className="relative w-6 h-4 shadow-sm rounded-[2px] overflow-hidden shrink-0">
                                <Image src={`https://flagcdn.com/${toCountryData.abbr}.svg`} alt={toCountryData.name} fill className="object-cover" />
                            </div>
                            <span className="font-medium">{flight.toCity}, {toCountryData.name}</span>
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
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="text-xs uppercase text-slate-500 font-bold">Дата на пътуване</FormLabel>
                                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            type="button"
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal h-10 border-slate-200 hover:bg-slate-50 text-xs",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "dd MMM yyyy", { locale: bg })
                                                            ) : (<span className="flex items-center gap-1 truncate"><CalendarIcon className="h-3 w-3 opacity-50" />Изберете дата</span>)}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="end">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            field.onChange(date);
                                                            setIsCalendarOpen(false);
                                                        }}
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

                                {/* Passengers */}
                                <FormField
                                    control={form.control}
                                    name="passengers"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase text-slate-500 font-bold">Пътници</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center h-10 border rounded-md px-1 border-slate-200">
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-slate-100" onClick={() => handlePassengerChange(-1)} disabled={field.value <= 1}><Minus className="h-3 w-3" /></Button>
                                                    <div className="flex-1 text-center font-bold text-sm">{field.value}</div>
                                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-slate-100" onClick={() => handlePassengerChange(1)} disabled={field.value >= 10}><Plus className="h-3 w-3" /></Button>
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
                                <FormField control={form.control} name="message" render={({ field }) => (<FormItem><FormLabel>Допълнителна Информация</FormLabel><FormControl><Textarea placeholder="Специфични изисквания, предпочитана авиокомпания и др." className="bg-slate-50/50 min-h-[100px] " {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>

                            {/* Price Display */}
                            <div className=" rounded-xl p-5 text-black mt-4 shadow-inner">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-sm text-black block mb-1">Ориентировъчна цена:</span>
                                        {calculation && (<div className="text-xs text-black flex items-center gap-1"><Info className="h-3 w-3" />{passengers} пътници x €{calculation.perPerson}</div>)}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-blue-600  tracking-tight block">{calculation ? `€${calculation.total.toLocaleString()}` : "—"}</span>
                                    </div>
                                </div>
                                {!calculation && (<p className="text-xs text-black mt-2 text-center border-t border-slate-800 pt-2">Цената зависи от избрания полет</p>)}
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
