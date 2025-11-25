import HeroVideo from "@/components/hero/hero-video";
import { ContactForm } from "@/components/contact/contact-form";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <HeroVideo
                className="min-h-[90vh]"
            // You can override the video sources here if needed, or stick to defaults
            >
                <div className="w-full max-w-4xl mx-auto pt-20 pb-10">
                    <ContactForm />
                </div>
            </HeroVideo>
        </main>
    );
}
