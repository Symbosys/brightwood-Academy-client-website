-- CreateTable
CREATE TABLE `AdmissionApplication` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `studentFirstName` VARCHAR(191) NOT NULL,
    `studentMiddleName` VARCHAR(191) NULL,
    `studentLastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `bloodGroup` VARCHAR(191) NULL,
    `nationality` VARCHAR(191) NOT NULL DEFAULT 'Indian',
    `religion` VARCHAR(191) NULL,
    `category` ENUM('GENERAL', 'OBC', 'SC', 'ST', 'EWS') NOT NULL,
    `aadharNumber` VARCHAR(191) NULL,
    `classApplyingFor` VARCHAR(191) NOT NULL,
    `previousSchool` VARCHAR(191) NULL,
    `previousClass` VARCHAR(191) NULL,
    `academicYear` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NOT NULL,
    `fatherOccupation` VARCHAR(191) NULL,
    `fatherPhone` VARCHAR(191) NOT NULL,
    `fatherEmail` VARCHAR(191) NULL,
    `motherName` VARCHAR(191) NOT NULL,
    `motherOccupation` VARCHAR(191) NULL,
    `motherPhone` VARCHAR(191) NULL,
    `motherEmail` VARCHAR(191) NULL,
    `guardianName` VARCHAR(191) NULL,
    `guardianRelation` VARCHAR(191) NULL,
    `guardianPhone` VARCHAR(191) NULL,
    `guardianEmail` VARCHAR(191) NULL,
    `currentAddress` VARCHAR(191) NOT NULL,
    `currentCity` VARCHAR(191) NOT NULL,
    `currentState` VARCHAR(191) NOT NULL,
    `currentPincode` VARCHAR(191) NOT NULL,
    `permanentAddress` VARCHAR(191) NOT NULL,
    `permanentCity` VARCHAR(191) NOT NULL,
    `permanentState` VARCHAR(191) NOT NULL,
    `permanentPincode` VARCHAR(191) NOT NULL,
    `medicalConditions` VARCHAR(191) NULL,
    `specialNeeds` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED', 'ADMITTED') NOT NULL DEFAULT 'PENDING',
    `applicationNumber` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `birthCertificate` VARCHAR(191) NULL,
    `photoUrl` VARCHAR(191) NULL,
    `transferCertificate` VARCHAR(191) NULL,
    `addressProof` VARCHAR(191) NULL,
    `submittedBy` VARCHAR(191) NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,

    UNIQUE INDEX `AdmissionApplication_aadharNumber_key`(`aadharNumber`),
    UNIQUE INDEX `AdmissionApplication_applicationNumber_key`(`applicationNumber`),
    INDEX `AdmissionApplication_applicationNumber_idx`(`applicationNumber`),
    INDEX `AdmissionApplication_status_idx`(`status`),
    INDEX `AdmissionApplication_academicYear_idx`(`academicYear`),
    INDEX `AdmissionApplication_classApplyingFor_idx`(`classApplyingFor`),
    INDEX `AdmissionApplication_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notice` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `content` LONGTEXT NULL,
    `category` ENUM('ADMISSION', 'EXAMINATION', 'HOLIDAY', 'EVENT', 'ACADEMIC', 'SPORTS', 'CULTURAL', 'GENERAL', 'IMPORTANT', 'RESULT', 'FEE', 'SCHOLARSHIP', 'VACANCY', 'TENDER') NOT NULL,
    `priority` ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    `publishDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiryDate` DATETIME(3) NULL,
    `eventDate` DATETIME(3) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `isPinned` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `author` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Notice_slug_key`(`slug`),
    INDEX `Notice_category_idx`(`category`),
    INDEX `Notice_priority_idx`(`priority`),
    INDEX `Notice_publishDate_idx`(`publishDate`),
    INDEX `Notice_isPublished_idx`(`isPublished`),
    INDEX `Notice_isPinned_idx`(`isPinned`),
    INDEX `Notice_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoticeAttachment` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fileName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `noticeId` VARCHAR(191) NOT NULL,

    INDEX `NoticeAttachment_noticeId_idx`(`noticeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactInquiry` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `subject` ENUM('ADMISSION_INQUIRY', 'GENERAL_SUPPORT', 'FEEDBACK', 'COMPLAINT', 'OTHERS') NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'NEW',
    `response` TEXT NULL,
    `respondedBy` VARCHAR(191) NULL,
    `respondedAt` DATETIME(3) NULL,
    `ipAddress` VARCHAR(191) NULL,

    INDEX `ContactInquiry_status_idx`(`status`),
    INDEX `ContactInquiry_createdAt_idx`(`createdAt`),
    INDEX `ContactInquiry_subject_idx`(`subject`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryImage` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `thumbnailUrl` VARCHAR(191) NULL,
    `category` ENUM('ACADEMIC', 'SPORTS', 'CULTURAL', 'EVENTS', 'INFRASTRUCTURE', 'ACHIEVEMENTS', 'CELEBRATIONS', 'OTHERS') NOT NULL,
    `eventName` VARCHAR(191) NULL,
    `eventDate` DATETIME(3) NULL,
    `uploadedBy` VARCHAR(191) NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,

    INDEX `GalleryImage_category_idx`(`category`),
    INDEX `GalleryImage_isPublished_idx`(`isPublished`),
    INDEX `GalleryImage_eventDate_idx`(`eventDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER') NOT NULL DEFAULT 'EDITOR',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLogin` DATETIME(3) NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    INDEX `Admin_email_idx`(`email`),
    INDEX `Admin_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NoticeAttachment` ADD CONSTRAINT `NoticeAttachment_noticeId_fkey` FOREIGN KEY (`noticeId`) REFERENCES `Notice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
