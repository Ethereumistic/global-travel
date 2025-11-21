"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

interface HolidayIncludedProps {
    included?: { text: string }[];
    notIncluded?: { text: string }[];
}

export function HolidayIncluded({ included, notIncluded }: HolidayIncludedProps) {
    return (
        <div className="space-y-6">

            {/* Included */}
            {included && included.length > 0 && (
                <Card className="border-green-200 bg-green-50/30 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold text-green-800 flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6" />
                            Цената включва
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                            {included.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 text-sm text-slate-800">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Not Included */}
            {notIncluded && notIncluded.length > 0 && (
                <Card className="border-red-200 bg-red-50/30 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold text-red-800 flex items-center gap-2">
                            <XCircle className="h-6 w-6" />
                            Цената не включва
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                            {notIncluded.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3 text-sm text-slate-800">
                                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
