--
-- Banco de Dados: `eventlayer`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `eventId` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `type` varchar(200) NOT NULL,
  `image` varchar(200) NOT NULL,
  `timeStart` datetime NOT NULL,
  `timeEnd` datetime NOT NULL,
  `description` text NOT NULL,
  `lecturerId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `placeId` int(11) NOT NULL,
  PRIMARY KEY (`eventId`),
  KEY `lecturerId` (`lecturerId`),
  KEY `userId` (`userId`),
  KEY `placeId` (`placeId`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `lecturers`
--

CREATE TABLE IF NOT EXISTS `lecturers` (
  `lecturerId` int(11) NOT NULL AUTO_INCREMENT,
  `lecturerName` varchar(200) NOT NULL,
  `biography` text NOT NULL,
  PRIMARY KEY (`lecturerId`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `places`
--

CREATE TABLE IF NOT EXISTS `places` (
  `placeId` int(11) NOT NULL AUTO_INCREMENT,
  `placeName` varchar(200) NOT NULL,
  `longitude` double(8,6) NOT NULL,
  `latitude` double(8,6) NOT NULL,
  PRIMARY KEY (`placeId`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;


-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(11) NOT NULL,
  `userName` varchar(200) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
