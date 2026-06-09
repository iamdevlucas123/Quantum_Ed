-- CreateEnum
CREATE TYPE "ActivityLogType" AS ENUM ('COURSE_STARTED', 'COURSE_PROGRESS', 'COURSE_COMPLETED', 'LESSON_STARTED', 'LESSON_COMPLETED', 'QUIZ_SUBMITTED', 'CERTIFICATE_EARNED', 'BADGE_EARNED', 'GOAL_UPDATED');

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "certificateUrl" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "type" "ActivityLogType" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "lessonId" INTEGER,
    "quizAttemptId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "lessonId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyGoal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Weekly Study Goal',
    "targetHours" INTEGER NOT NULL,
    "currentHours" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Certificate_userId_issuedAt_idx" ON "Certificate"("userId", "issuedAt");

-- CreateIndex
CREATE INDEX "Certificate_courseId_idx" ON "Certificate"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON "Certificate"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_slug_key" ON "Badge"("slug");

-- CreateIndex
CREATE INDEX "Badge_userId_awardedAt_idx" ON "Badge"("userId", "awardedAt");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_occurredAt_idx" ON "ActivityLog"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "ActivityLog_courseId_idx" ON "ActivityLog"("courseId");

-- CreateIndex
CREATE INDEX "ActivityLog_lessonId_idx" ON "ActivityLog"("lessonId");

-- CreateIndex
CREATE INDEX "ActivityLog_quizAttemptId_idx" ON "ActivityLog"("quizAttemptId");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_completedAt_idx" ON "QuizAttempt"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "QuizAttempt_courseId_idx" ON "QuizAttempt"("courseId");

-- CreateIndex
CREATE INDEX "QuizAttempt_lessonId_idx" ON "QuizAttempt"("lessonId");

-- CreateIndex
CREATE INDEX "StudyGoal_userId_isActive_idx" ON "StudyGoal"("userId", "isActive");

-- CreateIndex
CREATE INDEX "StudyGoal_userId_startsAt_idx" ON "StudyGoal"("userId", "startsAt");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_quizAttemptId_fkey" FOREIGN KEY ("quizAttemptId") REFERENCES "QuizAttempt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyGoal" ADD CONSTRAINT "StudyGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
