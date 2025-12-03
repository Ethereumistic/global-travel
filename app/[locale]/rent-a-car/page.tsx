import { PageSlider } from "@/components/layout/page-slider";
import { Car } from "lucide-react";
import { RentForm } from "@/components/rent-a-car/rent-form";

const RENT_A_CAR_HERO_IMAGES = [
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/1.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/2.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/3.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/4.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/5.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/6.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/7.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/8.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/9.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/10.jpg",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/rent-a-car/11.jpg",
];

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RentACarPage(props: PageProps) {
    const resolvedParams = await props.searchParams;

    return (
        <main className="min-h-screen bg-slate-50/50">
            <PageSlider
                images={RENT_A_CAR_HERO_IMAGES}
                title="Наемете Кола"
                subtitle="Изберете перфектния автомобил за вашето пътуване – комфорт, сигурност и стил."
                icon={<Car className="h-8 w-8 text-white" />}
                className="h-96 rounded-b-xl"
                searchType="none"
            />

            <div id="booking-sidebar" className="container mx-auto py-8 px-4">
                <RentForm
                    title="Запитване за Наемане на Кола"
                    description="Попълнете формата и ние ще Ви изпратим най-добрата оферта за автомобил"
                    submitText="Изпрати Запитване"
                    formType="Rent-a-Car"
                />
            </div>
        </main>
    );
}