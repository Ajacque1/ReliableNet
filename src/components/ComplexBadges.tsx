"use client"

import { Badge } from "@/components/ui/badge"
import { BADGES } from "@/lib/badges"
import { 
  Wifi, 
  Monitor, 
  Gamepad2, 
  DollarSign, 
  Users 
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ComplexBadgesProps {
  badges: string[]
}

const BADGE_ICONS = {
  wfh_friendly: Wifi,
  streamer_approved: Monitor,
  gamer_ready: Gamepad2,
  budget_friendly: DollarSign,
  family_choice: Users,
}

export function ComplexBadges({ badges }: ComplexBadgesProps) {
  if (!badges?.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      <TooltipProvider>
        {badges.map(badgeId => {
          const badge = BADGES.find(b => b.id === badgeId)
          if (!badge) return null

          const Icon = BADGE_ICONS[badgeId as keyof typeof BADGE_ICONS]

          return (
            <Tooltip key={badge.id}>
              <TooltipTrigger>
                <Badge 
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {badge.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{badge.description}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </div>
  )
} 