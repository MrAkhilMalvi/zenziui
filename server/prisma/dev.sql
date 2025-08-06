-- MySQL dump 10.13 Distrib 8.4.4, for Linux (x86_64)
--
-- Host: localhost Database: db
-- ------------------------------------------------------
-- Server version 8.4.4
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
--
-- Table structure for table `collections`
--
DROP TABLE IF EXISTS `collections`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collections` (
`id` varchar(0) DEFAULT NULL,
`name` varchar(0) DEFAULT NULL,
`description` varchar(0) DEFAULT NULL,
`isPublic` varchar(0) DEFAULT NULL,
`createdAt` varchar(0) DEFAULT NULL,
`updatedAt` varchar(0) DEFAULT NULL,
`authorId` varchar(0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `collections`
--
LOCK TABLES `collections` WRITE;
/*!40000 ALTER TABLE `collections` DISABLE KEYS */;
/*!40000 ALTER TABLE `collections` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Table structure for table `comments`
--
DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
`id` varchar(0) DEFAULT NULL,
`content` varchar(0) DEFAULT NULL,
`createdAt` varchar(0) DEFAULT NULL,
`updatedAt` varchar(0) DEFAULT NULL,
`authorId` varchar(0) DEFAULT NULL,
`componentId` varchar(0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `comments`
--
LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Table structure for table `component_collections`
--
DROP TABLE IF EXISTS `component_collections`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `component_collections` (
`id` varchar(0) DEFAULT NULL,
`collectionId` varchar(0) DEFAULT NULL,
`componentId` varchar(0) DEFAULT NULL,
`addedAt` varchar(0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `component_collections`
--
LOCK TABLES `component_collections` WRITE;
/*!40000 ALTER TABLE `component_collections` DISABLE KEYS */;
/*!40000 ALTER TABLE `component_collections` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Table structure for table `component_likes`
--
DROP TABLE IF EXISTS `component_likes`;
/*!40101 SET @saved_cs_client = @@character_set_client */;