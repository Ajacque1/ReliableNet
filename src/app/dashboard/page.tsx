import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SpeedTestHistory } from "@/components/SpeedTestHistory"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // Fetch speed tests for the user
  const rawSpeedTests = await prisma.speedTest.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Convert Date objects to strings and provide defaults for nullable fields
  const speedTests = rawSpeedTests.map(test => ({
    id: test.id,
    downloadSpeed: test.downloadSpeed,
    uploadSpeed: test.uploadSpeed,
    ping: test.ping,
    createdAt: test.createdAt.toISOString(),
    isp: test.isp || 'Unknown ISP'
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <SpeedTestHistory 
        userId={session.user.id} 
        speedTests={speedTests}
      />
    </div>
  )
} 