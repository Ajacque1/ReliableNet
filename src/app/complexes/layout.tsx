import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Apartment Complexes | ReliableNet",
  description: "Find and compare internet service providers in apartment complexes near you."
}

export default function ComplexesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 