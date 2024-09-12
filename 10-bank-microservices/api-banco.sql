-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-09-2024 a las 06:24:23
-- Versión del servidor: 10.4.20-MariaDB
-- Versión de PHP: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `api-banco`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbcuenta`
--

CREATE TABLE `tbcuenta` (
  `cuentaid` int(11) NOT NULL,
  `cuentaconcepto` varchar(30) NOT NULL,
  `cuentaIBAN` varchar(100) NOT NULL,
  `cuentaMonto` decimal(10,2) NOT NULL,
  `cuentaUsuarioId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbsobre`
--

CREATE TABLE `tbsobre` (
  `sobreid` int(11) NOT NULL,
  `sobrenombre` varchar(150) NOT NULL,
  `sobremonto` decimal(10,2) NOT NULL,
  `sobreCuentaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbusuario`
--

CREATE TABLE `tbusuario` (
  `usuarioid` int(11) NOT NULL,
  `usuarionombre` varchar(150) NOT NULL,
  `usuarioapellidos` varchar(200) NOT NULL,
  `usuariocedula` varchar(30) NOT NULL,
  `usuariopassword` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tbcuenta`
--
ALTER TABLE `tbcuenta`
  ADD PRIMARY KEY (`cuentaid`),
  ADD KEY `cuentaUsuarioId` (`cuentaUsuarioId`);

--
-- Indices de la tabla `tbsobre`
--
ALTER TABLE `tbsobre`
  ADD KEY `sobreCuentaId` (`sobreCuentaId`);

--
-- Indices de la tabla `tbusuario`
--
ALTER TABLE `tbusuario`
  ADD PRIMARY KEY (`usuarioid`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tbcuenta`
--
ALTER TABLE `tbcuenta`
  MODIFY `cuentaid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbusuario`
--
ALTER TABLE `tbusuario`
  MODIFY `usuarioid` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tbcuenta`
--
ALTER TABLE `tbcuenta`
  ADD CONSTRAINT `tbcuenta_ibfk_1` FOREIGN KEY (`cuentaUsuarioId`) REFERENCES `tbusuario` (`usuarioid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tbsobre`
--
ALTER TABLE `tbsobre`
  ADD CONSTRAINT `tbsobre_ibfk_1` FOREIGN KEY (`sobreCuentaId`) REFERENCES `tbcuenta` (`cuentaid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
