"use client";

import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_HERO_IMAGES = [
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/turkey.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/brazil.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/rome.png",
];

const FAQ_ITEMS = [
    {
        question: "Как мога да резервирам пътуване?",
        answer: "Можете да резервирате вашето пътуване, като посетите нашия уебсайт,или се обадите на нашия номер за обслужване на клиенти. Нашите експерти по пътувания са готови да Ви помогнат да планирате идеалната Ви ваканция."
    },
    {
        question: "Какви видове пътувания предлагате?",
        answer: "Предлагаме разнообразие от пътувания, включително пакети „всичко включено“, приключенски турове, градски почивки, семейни ваканции и персонализирани маршрути, адаптирани към вашите предпочитания и нужди."
    },
    {
        question: "Мога ли да персонализирам моя пакет за пътуване?",
        answer: "Разбира се! Специализирали сме в създаването на персонализирани пътешествия. Споделете с нас какво търсите, и нашият екип ще работи с вас, за да проектира пътуване, което отговаря на вашите мечти и бюджет."
    },
    {
        question: "Каква е политиката за анулиране?",
        answer: "Нашата политика за анулиране варира в зависимост от типа на резервацията и доставчиците, участващи в нея. Като цяло, анулирането направено достатъчно предварително получава пълно или частично възстановяване на сумата, докато анулирането в последния момент може да влече такса. Моля, прегледайте вашето потвърждение за резервация за конкретни детайли."
    },
    {
        question: "Предлагате ли застраховка за пътуване?",
        answer: "Да, настоятелно препоръчваме закупуването на застраховка за пътуване за защита на вашето пътуване срещу непредвидени обстоятелства. Предлагаме различни опции за застраховка, покриващи анулиране на пътуването, медицински извънредни ситуации и др."
    },
    {
        question: "Как мога да разбера, че моята резервация е потвърдена?",
        answer: "След като вашата резервация бъде потвърдена, ще получите имейл потвърждение с всички детайли за вашето пътуване, включително дати на пътуване, настаняване и всички допълнителни услуги, които сте избрали."
    },
    {
        question: "Какво да направя, ако трябва да променя датите на пътуването си или да анулирам пътуването си?",
        answer: "Моля, свържете се с нас възможно най-скоро. Нашият екип ще ви насочи през процеса и ще обсъди възможните такси или промени в цената въз основа на вашите нови дати за пътуване или искане за анулиране."
    },
    {
        question: "Има ли отстъпки за групови резервации?",
        answer: "Да, предлагаме специални тарифи за групи, които пътуват заедно. Свържете се с нас с подробности за вашата група, и ние ще ви предоставим най-добрите налични опции."
    },
    {
        question: "Какви документи са ми необходими за пътуване?",
        answer: "Необходимите документи за пътуване могат да варират в зависимост от дестинацията и включват валиден паспорт, визи, сертификати за ваксинация и застраховка за пътуване. Нашият съветник по пътувания може да предостави насоки въз основа на вашия конкретен маршрут."
    },
    {
        question: "Как мога да се свържа с Global Travel за допълнителна помощ?",
        answer: "Ние сме тук, за да помогнем! Можете да се свържете с нас по телефон на +359 884091616 и +359 888862348 или чрез имейл на reservation@global-travel.bg. Нашето работно време е 24/7."
    }
];

function FaqHero() {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % FAQ_HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[400px] overflow-hidden flex items-center -mt-20">
            {/* Background Images */}
            <div className="absolute inset-0 z-0">
                {FAQ_HERO_IMAGES.map((img, index) => (
                    <div
                        key={img}
                        className={cn(
                            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out",
                            index === currentImageIndex ? "opacity-100" : "opacity-0"
                        )}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4 pt-20">
                <div className="flex flex-col justify-center items-center text-center text-white animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 mb-6">
                        <HelpCircle className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl drop-shadow-md mb-4">
                        Често Задавани Въпроси
                    </h1>
                    <p className="text-lg text-gray-100 md:text-xl max-w-2xl drop-shadow-sm leading-relaxed">
                        Тук ще намерите отговори на най-често задаваните въпроси относно нашите услуги и пътувания.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function FaqPage() {
    return (
        <main className="min-h-screen bg-slate-50/50">
            <FaqHero />

            <div className="container mx-auto py-16 px-4 max-w-4xl">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {FAQ_ITEMS.map((item, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border rounded-lg px-6 bg-white shadow-sm data-[state=open]:border-primary/50 transition-all last:border-b"
                        >
                            <AccordionTrigger className="hover:no-underline py-6 text-lg font-semibold text-slate-900 text-left">
                                <span className="flex gap-4">
                                    <span className="text-primary/40 font-bold min-w-[24px]">{index + 1}.</span>
                                    {item.question}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 text-slate-600 leading-relaxed text-base pl-10">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                <div className="mt-12 text-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Не намирате отговора, който търсите?</h3>
                    <p className="text-slate-500 mb-6">Нашият екип е на разположение 24/7, за да ви помогне с всякакви въпроси.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="tel:+359884091616"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
                        >
                            Обадете ни се
                        </a>
                        <a
                            href="mailto:reservation@global-travel.bg"
                            className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        >
                            Изпратете имейл
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
