"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { Calendar as CalendarIcon, CheckCircle2, Loader2, X, Search, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { ALL_COUNTRIES } from "@/lib/constants";

const FormSchema = z.object({
    fullName: z.string().min(2, { message: "Моля въведете име" }),
    email: z.string().email({ message: "Невалиден имейл" }),
    phone: z.string().min(6, { message: "Невалиден телефон" }),
    guests: z.string().min(1, { message: "Моля въведете брой гости" }),
    destination: z.string().optional(),
    dateRange: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
    }).optional(),
    message: z.string().optional(),
});

interface ContactFormProps {
    onClose?: () => void;
    /** The title displayed at the top of the card */
    title?: string;
    /** The subtitle description */
    description?: string;
    /** Text displayed on the submit button */
    submitText?: string;
    /** * Internal type for the form submission. 
     * This will appear in the email subject line (e.g., "Rent-a-Car", "Personal").
     */
    formType?: string;
}

export function ContactForm({
    onClose,
    title = "Персонално Запитване",
    description = "Попълнете формата и ние ще организираме Вашето мечтано пътуване",
    submitText = "Изпрати Запитване",
    formType = "Персонално Запитване"
}: ContactFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [openDestination, setOpenDestination] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            guests: "2",
            destination: "",
            message: "",
        },
    });

    // Helper to get country data
    const getCountryData = (name: string) => {
        const match = ALL_COUNTRIES.find(c => c.name === name);
        if (match) {
            return {
                name: match.name,
                flagUrl: `https://flagcdn.com/${match.abbr.toLowerCase()}.svg`
            };
        }
        return null;
    };

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

            if (!accessKey) {
                toast.error("System Configuration Error: Missing Web3Forms Key");
                setIsSubmitting(false);
                return;
            }

            // --- WEB3FORMS CONFIGURATION ---
            formData.append("access_key", accessKey);

            // This sets the email Subject line to something like: "Rent-a-Car - Ivan Ivanov"
            formData.append("subject", `${formType} - ${data.fullName}`);

            // Add the hidden form type to the email body
            formData.append("Inquiry Type", formType);

            // --- FORM DATA ---
            formData.append("full_name", data.fullName);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("guests", data.guests);
            formData.append("destination", data.destination || "Not specified");

            if (data.message) {
                formData.append("message", data.message);
            }

            if (data.dateRange?.from) {
                formData.append("date_from", format(data.dateRange.from, "dd MMM yyyy", { locale: bg }));
            }
            if (data.dateRange?.to) {
                formData.append("date_to", format(data.dateRange.to, "dd MMM yyyy", { locale: bg }));
            }

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                setIsSuccess(true);
                toast.success("Запитването е изпратено успешно!");
                form.reset();
            } else {
                toast.error("Възникна грешка при изпращането. Моля опитайте отново.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Възникна грешка. Моля проверете връзката си.");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleGuestChange = (delta: number) => {
        const current = parseInt(form.getValues("guests")) || 1;
        const max = 100;
        const newVal = Math.min(Math.max(current + delta, 1), max);
        form.setValue("guests", newVal.toString());
    };

    if (isSuccess) {
        return (
            <Card className="max-w-5xl mx-auto shadow-2xl transition-all duration-300 bg-black/30 backdrop-blur-md border-white/10 text-white ring-0">
                <CardContent className="pt-20 pb-20 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-400" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Благодарим Ви!</h2>
                    <p className="text-xl text-gray-200 mb-8 max-w-lg mx-auto">
                        Вашето запитване ({formType}) беше изпратено успешно. Наш консултант ще се свърже с Вас възможно най-скоро.
                    </p>
                    <Button
                        className="mt-8 "
                        onClick={() => setIsSuccess(false)}
                    >
                        Изпрати ново запитване
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-5xl mx-auto shadow-2xl transition-all duration-300 bg-black/30 backdrop-blur-md border-white/10 text-white ring-0 relative">
            {onClose && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 text-white/70 hover:text-white hover:bg-white/10 rounded-full z-10"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </Button>
            )}

            <CardHeader className="text-center pb-4 border-b border-white/10">
                <CardTitle className="text-xl sm:text-3xl font-bold text-white flex items-center justify-start md:justify-center gap-3 text-nowrap">
                    {title}
                </CardTitle>
                <CardDescription className="hidden sm:block text-lg mt-2 text-gray-200">
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent className="">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* ROW 1: Contact Info (Name, Email, Phone) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Име и Фамилия <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Иван Иванов"
                                                className="h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-white/30"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Email <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="ivan@example.com"
                                                className="h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-white/30"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Телефон <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+359..."
                                                className="h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-white/30"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* ROW 2: Details (Destination, Period, Guests) */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Destination */}
                            <FormField
                                control={form.control}
                                name="destination"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 md:col-span-1 flex flex-col">
                                        <FormLabel className="text-gray-200 truncate">Дестинация</FormLabel>
                                        <Popover open={openDestination} onOpenChange={setOpenDestination}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "h-11 justify-between text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white px-3 w-full",
                                                            !field.value && "text-gray-400"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            <div className="flex items-center gap-2 overflow-hidden w-full">
                                                                {(() => {
                                                                    const data = getCountryData(field.value);
                                                                    return data ? (
                                                                        <>
                                                                            <div className="relative w-5 h-3.5 shadow-sm rounded-sm overflow-hidden shrink-0">
                                                                                <Image
                                                                                    src={data.flagUrl}
                                                                                    alt={data.name}
                                                                                    fill
                                                                                    className="object-cover"
                                                                                />
                                                                            </div>
                                                                            <span className="font-medium text-white truncate">{data.name}</span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="font-medium text-white truncate">{field.value}</span>
                                                                    );
                                                                })()}
                                                            </div>
                                                        ) : (
                                                            <span className="flex items-center gap-2 truncate">
                                                                <Search className="h-4 w-4 opacity-50 shrink-0" />
                                                                <span className="truncate">Търси...</span>
                                                            </span>
                                                        )}
                                                        {field.value && (
                                                            <div
                                                                className="ml-auto pl-2 flex items-center justify-center h-5 w-5 rounded-full cursor-pointer hover:bg-white/20 shrink-0"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    form.setValue("destination", "");
                                                                }}
                                                            >
                                                                <X className="h-3 w-3 text-white" />
                                                            </div>
                                                        )}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0" align="start">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Търси държава или напиши..."
                                                        value={searchValue}
                                                        onValueChange={setSearchValue}
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            <div className="p-2">
                                                                <p className="text-sm text-muted-foreground mb-2">Няма намерени резултати.</p>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="w-full justify-start"
                                                                    onClick={() => {
                                                                        form.setValue("destination", searchValue);
                                                                        setOpenDestination(false);
                                                                    }}
                                                                >
                                                                    <span className="mr-2">🌍</span>
                                                                    Използвай "{searchValue}"
                                                                </Button>
                                                            </div>
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {ALL_COUNTRIES.map((country) => (
                                                                <CommandItem
                                                                    key={country.abbr}
                                                                    value={country.name}
                                                                    onSelect={() => {
                                                                        form.setValue("destination", country.name);
                                                                        setOpenDestination(false);
                                                                    }}
                                                                >
                                                                    <div className="flex items-center gap-3 w-full">
                                                                        <div className="relative w-6 h-4 shadow-sm rounded-sm overflow-hidden shrink-0">
                                                                            <Image
                                                                                src={`https://flagcdn.com/${country.abbr.toLowerCase()}.svg`}
                                                                                alt={country.name}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        </div>
                                                                        <span>{country.name}</span>
                                                                    </div>
                                                                    {country.name === field.value && (
                                                                        <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                                                                    )}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date Range */}
                            <FormField
                                control={form.control}
                                name="dateRange"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 flex flex-col">
                                        <FormLabel className="text-gray-200 truncate">Период</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-11 justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white px-2 w-full",
                                                        !field.value && "text-gray-400"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 hidden sm:block" />
                                                    {field.value?.from ? (
                                                        field.value.to ? (
                                                            <div className="flex flex-col leading-tight truncate">
                                                                <span className="text-[11px] sm:text-xs font-semibold">{format(field.value.from, "dd.MM", { locale: bg })}</span>
                                                                <span className="text-[10px] opacity-70">до {format(field.value.to, "dd.MM", { locale: bg })}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="truncate text-xs sm:text-sm">
                                                                {format(field.value.from, "dd MMM", { locale: bg })}
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span className="truncate flex items-center"><CalendarIcon className="h-3 w-3 mr-1 sm:hidden opacity-70" />Дати</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    initialFocus
                                                    mode="range"
                                                    defaultMonth={field.value?.from}
                                                    selected={field.value as any}
                                                    onSelect={field.onChange}
                                                    numberOfMonths={2}
                                                    locale={bg}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Guest Selector */}
                            <FormField
                                control={form.control}
                                name="guests"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel className="text-gray-200">Гости</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center h-11 border border-white/20 bg-white/10 rounded-md px-0 sm:px-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-8 shrink-0 text-white hover:bg-white/20 hover:text-white"
                                                    onClick={() => handleGuestChange(-1)}
                                                    disabled={parseInt(field.value) <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <div className="flex-1 text-center font-bold text-sm sm:text-lg text-white">
                                                    {field.value}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-8 shrink-0 text-white hover:bg-white/20 hover:text-white"
                                                    onClick={() => handleGuestChange(1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* ROW 3: Message */}
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Допълнителна информация</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Въведете допълнителни изисквания или въпроси..."
                                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-white/30 min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-500 shadow-xl transition-all hover:scale-[1.01] border-none"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Изпращане...
                                    </>
                                ) : (
                                    submitText
                                )}
                            </Button>
                            <p className="text-center text-[10px] sm:text-xs mt-3 text-gray-300 opacity-80">
                                * Вашите данни са защитени и ще бъдат използвани само за целите на това запитване.
                            </p>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}