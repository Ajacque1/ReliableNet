-- Add notifications field to User table
ALTER TABLE "public"."User" ADD COLUMN "notifications" JSONB NOT NULL DEFAULT '{"speedTestReminders": false, "newReviews": false, "ispUpdates": false}'; 