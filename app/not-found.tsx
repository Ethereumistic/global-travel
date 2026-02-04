import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, FileQuestion, Home, Palmtree } from 'lucide-react'
import { PageSlider } from '@/components/layout/page-slider'
import { Alert } from '@/components/ui/alert';

const HOLIDAY_HERO_IMAGES = [
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/brazil.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/cambodia.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/china.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/egypt.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/germany.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/india.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/japan.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/mexico.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/peru.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/petra.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/romania.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/rome.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/spain.png",
    "https://cdn.jsdelivr.net/gh/Ethereumistic/global-travel-assets/hero/img/turkey.png",
];

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 mb-8">

            <PageSlider
                images={HOLIDAY_HERO_IMAGES}
                title="Има грешка"
                subtitle=" "
                icon={<AlertTriangle className="h-8 w-8 text-white" />}
                className="h-96 rounded-b-xl"
                searchType="none"
            />
            <div className="relative">
                <div className="absolute -inset-4 bg-blue-100 rounded-full blur-xl opacity-50 dark:bg-blue-900/30"></div>
                <FileQuestion className="relative w-24 h-24 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="space-y-4 max-w-md">
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Страницата не е намерена
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Съжаляваме, но страницата, която търсите, не съществува или е била преместена.
                </p>
            </div>

            <div className="flex gap-4">
                <Button asChild size="lg" className="gap-2">
                    <Link href="/">
                        <Home className="w-4 h-4" />
                        Към Началото
                    </Link>
                </Button>
            </div>
        </div>
    )
}
