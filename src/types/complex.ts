export interface SpeedTest {
  id: string
  userId: string
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  createdAt: string
  asn?: string
  city?: string
  country?: string
  isp?: string
  ispOrg?: string
  latitude?: number
  longitude?: number
  state?: string
  zip?: string
  complexId?: string
}

export interface Complex {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  latitude?: number
  longitude?: number
  website?: string
  amenities: string[]
  createdAt: string
  updatedAt: string
  reviews: ComplexReview[]
  isps: ComplexISP[]
  speedTests: SpeedTest[]
}

export interface ComplexReview {
  id: string
  complexId: string
  userId: string
  rating: number
  internetRating: number
  comment?: string
  pros: string[]
  cons: string[]
  verified: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
  user: {
    name: string
    image?: string
  }
}

export interface ComplexISP {
  id: string
  complexId: string
  ispMetricId: string
  isDefault: boolean
  coverage: number
  speedTests: number
  createdAt: string
  updatedAt: string
  ispMetric: {
    isp: string
    avgDownload: number
    avgUpload: number
    avgPing: number
  }
}

export interface ISPMetrics {
  id: string
  isp: string
  avgDownload: number
  avgUpload: number
  avgPing: number
  testCount: number
  peakHourAvgDown?: number
  peakHourAvgUp?: number
  peakHourAvgPing?: number
  offPeakAvgDown?: number
  offPeakAvgUp?: number
  offPeakAvgPing?: number
  reliability?: number
  city?: string
  state?: string
  country?: string
  updatedAt: string
} 