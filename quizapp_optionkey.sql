-- --- GRoup members:
-- Samarth Joisar 8746581
-- Neel patel 8775032
-- Shreyansh Chavda 8758173

-- MySQL dump 10.13  Distrib 8.0.27, for macos11 (x86_64)
--
-- Host: 127.0.0.1    Database: quizapp
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `optionkey`
--

DROP TABLE IF EXISTS `optionkey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `optionkey` (
  `optionid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `questions_quedstionsid` int(11) NOT NULL,
  PRIMARY KEY (`optionid`),
  KEY `fk_optionkey_questions1_idx` (`questions_quedstionsid`),
  CONSTRAINT `fk_optionkey_questions1` FOREIGN KEY (`questions_quedstionsid`) REFERENCES `questions` (`quedstionsid`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `optionkey`
--

LOCK TABLES `optionkey` WRITE;
/*!40000 ALTER TABLE `optionkey` DISABLE KEYS */;
INSERT INTO `optionkey` VALUES (5,'op11',8),(6,'op12',8),(7,'op13',8),(8,'op14',8),(9,'op21',9),(10,'op22',9),(11,'op23',9),(12,'op24',9),(13,'op31',10),(14,'op32',10),(15,'op33',10),(16,'op34',10),(17,'op41',11),(18,'op42',11),(19,'op43',11),(20,'op44',11),(21,'op1',12),(22,'op2',12),(23,'op3',12),(24,'op4',12),(25,'option 1',13),(26,'option 2',13),(27,'option 3',13),(28,'option 4',13),(29,'op21',14),(30,'op22',14),(31,'op23',14),(32,'op24',14);
/*!40000 ALTER TABLE `optionkey` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-19 20:44:01
