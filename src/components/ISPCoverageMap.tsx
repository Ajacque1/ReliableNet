"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface CoveragePoint {
  latitude: number
  longitude: number
  signalStrength: number
  technology: string
  maxSpeed: number
}

interface ISPCoverageMapProps {
  ispName: string
  city?: string
  state?: string
}

export function ISPCoverageMap({ ispName, city, state }: ISPCoverageMapProps) {
  const [coverage, setCoverage] = useState<CoveragePoint[]>([])
  const [center, setCenter] = useState<[number, number]>([0, 0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const params = new URLSearchParams({
          isp: ispName,
          ...(city && { city }),
          ...(state && { state }),
        })

        const response = await fetch(`/api/isp/coverage?${params}`)
        const data = await response.json()

        setCoverage(data.coverage)
        
        // Set map center to first coverage point or specified city
        if (data.coverage.length > 0) {
          setCenter([data.coverage[0].latitude, data.coverage[0].longitude])
        }
        
      } catch (error) {
        console.error('Failed to fetch coverage data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCoverage()
  }, [ispName, city, state])

  if (loading) return <div>Loading coverage map...</div>

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {coverage.map((point, index) => (
          <Circle
            key={index}
            center={[point.latitude, point.longitude]}
            radius={200}
            pathOptions={{
              color: getColorForSignalStrength(point.signalStrength),
              fillOpacity: 0.6,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{point.technology}</h3>
                <p>Max Speed: {point.maxSpeed} Mbps</p>
                <p>Signal Strength: {(point.signalStrength * 100).toFixed(0)}%</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  )
}

function getColorForSignalStrength(strength: number): string {
  if (strength >= 0.8) return '#22c55e' // Strong - green
  if (strength >= 0.5) return '#eab308' // Medium - yellow
  return '#ef4444' // Weak - red
} 