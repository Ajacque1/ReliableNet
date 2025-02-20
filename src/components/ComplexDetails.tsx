"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, MapPin, Globe, Check } from "lucide-react"

interface ComplexDetailsProps {
  complex: {
    name: string
    address: string
    city: string
    state: string
    zip: string
    website?: string
    amenities: string[]
    isps: Array<{
      ispMetric: {
        isp: string
        avgDownload: number
        avgUpload: number
      }
      isDefault: boolean
    }>
  }
}

export function ComplexDetails({ complex }: ComplexDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{complex.name}</span>
          {complex.website && (
            <a 
              href={complex.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center"
            >
              <Globe className="h-4 w-4 mr-1" />
              Website
            </a>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </h3>
          <p className="mt-1 text-gray-600">
            {complex.address}<br />
            {complex.city}, {complex.state} {complex.zip}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium flex items-center">
            <Wifi className="h-4 w-4 mr-2" />
            Internet Providers
          </h3>
          <div className="mt-2 space-y-2">
            {complex.isps.map((isp) => (
              <div 
                key={isp.ispMetric.isp} 
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium flex items-center">
                    {isp.ispMetric.isp}
                    {isp.isDefault && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Default Provider
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isp.ispMetric.avgDownload.toFixed(1)} Mbps down / {isp.ispMetric.avgUpload.toFixed(1)} Mbps up
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {complex.amenities.length > 0 && (
          <div>
            <h3 className="text-sm font-medium">Internet Amenities</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {complex.amenities.map((amenity) => (
                <div 
                  key={amenity}
                  className="flex items-center text-sm text-gray-600"
                >
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 