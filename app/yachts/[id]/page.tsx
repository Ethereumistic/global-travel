import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getYachtById } from "@/app/actions/get-yachts";
import YachtDetailClient from "./client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const yacht = await getYachtById(id);

  if (!yacht) {
    return {
      title: "Яхта | Global Travel",
    };
  }

  // Strip HTML tags if necessary, though description seems plain text mostly
  const description = yacht.description
    ? yacht.description.replace(/<[^>]*>/g, '').slice(0, 160) + '...'
    : `Наемете яхта ${yacht.name} - Global Travel`;

  return {
    title: yacht.name,
    description: description,
    openGraph: {
      title: yacht.name,
      description: description,
      images: yacht.main_image ? [yacht.main_image.image] : [],
    },
  };
}

export default async function YachtDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ c?: string }>;
}) {
  const { id } = await params;
  const resolvedParams = await searchParams;

  // Fetch initial data on server for better performance and SEO support
  const yacht = await getYachtById(id);

  if (!yacht) {
    notFound();
  }

  return (
    <YachtDetailClient
      id={id}
      initialYacht={yacht}
      urlCountryCode={resolvedParams.c}
    />
  );
}