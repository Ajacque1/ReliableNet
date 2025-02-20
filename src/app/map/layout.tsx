import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Apartment Complex Map | ReliableNet",
  description: "View apartment complexes and their internet service providers on an interactive map."
}

export default function MapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 