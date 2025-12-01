"use client";

import { Info } from "lucide-react";

interface HotelDescriptionProps {
    description: string;
}

export function HotelDescription({ description }: HotelDescriptionProps) {
    if (!description) return null;

    // Parse the description string to extract sections
    // The format is typically: <h5>Title</h5><p>Content</p>
    // We'll split by <h5> to get chunks, then extract title and content
    const sections = description.split("<h5>").filter(Boolean).map(chunk => {
        const [title, ...rest] = chunk.split("</h5>");
        const content = rest.join("</h5>"); // Rejoin just in case, though unlikely needed
        return {
            title: title.trim(),
            content: content.trim()
        };
    });

    // If parsing fails or structure is different, fallback to raw HTML
    if (sections.length === 0) {
        return (
            <div className="prose max-w-none text-slate-600 leading-relaxed bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Описание
                </h3>
                <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-4">
                <Info className="h-5 w-5 text-primary" />
                Описание на хотела
            </h3>

            <div className="grid gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        <h4 className="text-lg font-semibold text-slate-800">
                            {section.title}
                        </h4>
                        <div
                            className="text-slate-600 leading-relaxed prose max-w-none prose-p:my-0 prose-p:leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
