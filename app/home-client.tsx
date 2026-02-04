"use client";

import { useState } from 'react';
import HeroVideo from '@/components/hero/hero-video';
import { HolidayCard } from '@/components/holiday/holiday-card';
import { Holiday } from '@/lib/types-holiday';
import { ALL_COUNTRIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ContactForm } from '@/components/contact/contact-form';
import { useMediaQuery } from '@/hooks/use-media-query';
import { getHolidays } from '@/app/actions/get-holidays';

interface HomeClientProps {
    initialHolidays: Holiday[];
}

export function HomeClient({ initialHolidays }: HomeClientProps) {
    const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
    const [loading, setLoading] = useState(false); // Only for country change
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [offset, setOffset] = useState(initialHolidays.length);
    const [hasMore, setHasMore] = useState(true);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const showContactForm = searchParams.get('action') === 'contact';
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleCloseContact = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('action');
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleSearch = async (countryCode: string) => {
        setSelectedCountry(countryCode);
        setLoading(true);
        setOffset(0); // Reset for new search

        try {
            // Fetch fresh batch for the new country
            const initialLimit = 8;
            const newHolidays = await getHolidays(initialLimit, 0, countryCode);
            setHolidays(newHolidays);
            setOffset(newHolidays.length);
            setHasMore(newHolidays.length === initialLimit);
        } catch (error) {
            console.error("Error filtering holidays:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowMore = async () => {
        setLoadingMore(true);
        try {
            const limit = 8;
            const newBatch = await getHolidays(limit, offset, selectedCountry || null);

            if (newBatch.length < limit) {
                setHasMore(false);
            }

            if (newBatch.length > 0) {
                setHolidays(prev => [...prev, ...newBatch]);
                setOffset(prev => prev + newBatch.length);
            } else {
                setHasMore(false);
            }

        } catch (error) {
            console.error("Error loading more holidays:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const countryName = selectedCountry
        ? ALL_COUNTRIES.find(c => c.abbr === selectedCountry)?.name || selectedCountry.toUpperCase()
        : null;

    return (
        <div>
            <div className='-mt-20'>
                <HeroVideo onSearch={handleSearch}>
                    {showContactForm && isDesktop && (
                        <div className="w-full max-w-4xl mx-auto pt-20 pb-10">
                            <ContactForm onClose={handleCloseContact} />
                        </div>
                    )}
                </HeroVideo>
            </div>

            <Dialog open={showContactForm && !isDesktop} onOpenChange={(open) => !open && handleCloseContact()}>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
                    <ContactForm onClose={handleCloseContact} />
                </DialogContent>
            </Dialog>

            {/* Holidays Section */}
            <div id="holidays-section" className="container mx-auto py-12 px-4">
                <div className="flex items-center gap-3 mb-8">
                    {selectedCountry && (
                        <img
                            src={`https://flagcdn.com/${selectedCountry}.svg`}
                            alt="flag"
                            className="w-8 h-auto shadow-sm rounded-sm"
                        />
                    )}
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        {selectedCountry ? `Почивки в ${countryName}` : "Препоръчани Почивки"}
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Зареждане...</h3>
                    </div>
                ) : holidays.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {holidays.map((holiday) => (
                                <div key={holiday.id} className="h-full">
                                    <HolidayCard holiday={holiday} />
                                </div>
                            ))}
                        </div>

                        {/* Show More Button */}
                        {hasMore && (
                            <div className="flex justify-center mt-12">
                                <Button
                                    onClick={handleShowMore}
                                    disabled={loadingMore}
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-medium shadow-lg transition-all hover:shadow-xl"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Зареждане...
                                        </>
                                    ) : (
                                        <>
                                            Покажи още
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Няма намерени почивки</h3>
                        <p className="text-slate-500 mt-2">Нямаме налични оферти за тази дестинация в момента.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
