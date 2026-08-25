import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getListingById } from "@/lib/employer-listings";
import { getApplicantsForListing } from "@/lib/applicants";
import ListingDetailClient from "./listing-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: "Listing not found" };
  return { title: `${listing.title} — Applicants` };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) notFound();

  const applicants = getApplicantsForListing(id);

  return <ListingDetailClient listing={listing} initialApplicants={applicants} />;
}