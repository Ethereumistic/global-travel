"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const languages = [
    { code: "en", name: "EN", flag: "https://flagcdn.com/gb.svg" },
    { code: "bg", name: "BG", flag: "https://flagcdn.com/bg.svg" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === currentLocale);

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
        <Image
          src={currentLanguage?.flag || languages[0].flag}
          alt={`${currentLanguage?.name} flag`}
          width={24}
          height={16}
          className="rounded"
        />
        <span className="text-sm font-medium">{currentLanguage?.name}</span>
        <ChevronDown className="w-4 h-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src={lang.flag}
              alt={`${lang.name} flag`}
              width={24}
              height={16}
              className="rounded"
            />
            <span className="text-sm font-medium">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}