"use client";

import { Clock, AlertCircle, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Hotel } from "@/lib/types-hotel";

interface HotelInfoProps {
    hotel: Hotel;
}

export function HotelInfo({ hotel }: HotelInfoProps) {
    return (
        <div className="space-y-6">
            {/* Check-in / Check-out */}
            {(hotel.checkin_policy || hotel.checkout_policy) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Настаняване и Напускане
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {hotel.checkin_policy && (
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900 mb-1">Настаняване</h4>
                                <div className="text-sm text-slate-600">
                                    <p>От: {hotel.checkin_policy.begin_time}</p>
                                    {hotel.checkin_policy.end_time && <p>До: {hotel.checkin_policy.end_time}</p>}
                                    {hotel.checkin_policy.min_age && <p>Минимална възраст: {hotel.checkin_policy.min_age}</p>}
                                    {hotel.checkin_policy.instructions && (
                                        <div className="mt-2 prose-sm" dangerouslySetInnerHTML={{ __html: hotel.checkin_policy.instructions }} />
                                    )}
                                </div>
                            </div>
                        )}
                        {hotel.checkout_policy && (
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900 mb-1">Напускане</h4>
                                <div className="text-sm text-slate-600">
                                    <p>До: {hotel.checkout_policy.time}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Fees */}
            {hotel.fees && (hotel.fees.mandatory || hotel.fees.optional) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Такси и Депозити
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {hotel.fees.mandatory && (
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900 mb-1">Задължителни такси</h4>
                                <div className="text-sm text-slate-600 prose-sm" dangerouslySetInnerHTML={{ __html: hotel.fees.mandatory }} />
                            </div>
                        )}
                        {hotel.fees.optional && (
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900 mb-1">Допълнителни такси</h4>
                                <div className="text-sm text-slate-600 prose-sm" dangerouslySetInnerHTML={{ __html: hotel.fees.optional }} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
