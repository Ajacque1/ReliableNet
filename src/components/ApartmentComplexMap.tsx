"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import { Card } from "@/components/ui/card"
import { Building, Wifi } from "lucide-react"
import Link from "next/link"
import "leaflet/dist/leaflet.css"

interface ApartmentComplex {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  latitude: number
  longitude: number
  isps: {
    ispMetric: {
      isp: string
      avgDownload: number
    }
  }[]
}

interface ApartmentComplexMapProps {
  complexes: ApartmentComplex[]
  center?: [number, number]
  zoom?: number
}

// Fix for Leaflet marker icons in Next.js
const markerIcon = new Icon({
  iconUrl: "/marker.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export function ApartmentComplexMap({
  complexes,
  center = [37.7749, -122.4194], // Default to San Francisco
  zoom = 12,
}: ApartmentComplexMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <p>Loading map...</p>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complexes.map((complex) => (
          <Marker
            key={complex.id}
            position={[complex.latitude, complex.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <Link
                  href={`/complexes/${complex.id}`}
                  className="font-medium hover:text-primary flex items-center gap-1"
                >
                  <Building className="h-4 w-4" />
                  {complex.name}
                </Link>
                <p className="text-sm text-muted-foreground mt-1">
                  {complex.address}
                </p>
                {complex.isps.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Available ISPs:</p>
                    <div className="space-y-1">
                      {complex.isps.map((isp, index) => (
                        <div
                          key={index}
                          className="text-sm flex items-center justify-between"
                        >
                          <span className="flex items-center gap-1">
                            <Wifi className="h-3 w-3" />
                            {isp.ispMetric.isp}
                          </span>
                          <span>{isp.ispMetric.avgDownload.toFixed(0)} Mbps</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  )
} 