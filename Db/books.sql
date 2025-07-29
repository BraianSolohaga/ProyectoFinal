-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-07-2025 a las 04:16:30
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `books`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blacklisted_tokens`
--

CREATE TABLE `blacklisted_tokens` (
  `id` int(11) NOT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `cover` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `is_favorite` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `year`, `publisher`, `cover`, `created_at`, `description`, `is_favorite`) VALUES
(1, 'Cien años de soledad', 'Gabriel García Márquez', 1967, 'Editorial Sudamericana', 'https://librarycars-api-solohaga.s3.us-east-1.amazonaws.com/cien_a%C3%B1os_de_soledad.webp', '2025-07-14 21:17:49', 'Cien Años de Soledad – Gabriel García Márquez\r\n\"Cien Años de Soledad\" es la obra maestra del escritor colombiano Gabriel García Márquez, publicada en 1967. Esta novela es uno de los pilares del realismo mágico y cuenta la historia de la familia Buendía, cuyos miembros están marcados por destinos trágicos, pasiones desbordadas y una lucha constante contra el tiempo y la soledad.\r\n\r\nLa historia se desarrolla en el ficticio pueblo de Macondo, fundado por José Arcadio Buendía y su esposa Úrsula Iguarán, quienes buscan escapar de las limitaciones de la vida cotidiana. A lo largo de la novela, los Buendía atraviesan múltiples generaciones, cada una caracterizada por repeticiones cíclicas de eventos, como el amor incestuoso, la guerra, la soledad, el destino inevitable y las tragedias personales.\r\n\r\nA medida que la novela avanza, los personajes luchan con la fatalidad y las maldiciones que parecen seguir a la familia Buendía. A través de este enfoque narrativo, García Márquez presenta temas de la historia de América Latina, la guerra, el poder y el amor, al tiempo que ilustra cómo el pasado afecta el futuro. Los elementos fantásticos, como los presagios y las visiones sobrenaturales, se entrelazan con lo cotidiano, creando un mundo donde lo real y lo mágico son indistinguibles.\r\n\r\nEl final de la obra es igualmente simbólico y cerrado en un ciclo, donde la fatalidad parece inevitable y las mismas historias se repiten, lo que refuerza el tema de la soledad a lo largo del tiempo.', 0),
(2, 'El Principito', 'Antoine de Saint-Exupéry', 1943, 'Reynal & Hitchcock', 'https://librarycars-api-solohaga.s3.us-east-1.amazonaws.com/el_principito.webp', '2025-07-24 17:36:39', 'El Principito – Antoine de Saint-Exupéry\r\n\"El Principito\" es un cuento filosófico escrito por el autor y aviador francés Antoine de Saint-Exupéry. Publicado en 1943, es una obra que ha cautivado tanto a niños como adultos debido a sus profundas enseñanzas sobre la vida, el amor, y la naturaleza humana.\r\n\r\nLa historia sigue a un aviador que, tras un accidente en el desierto del Sahara, se encuentra con un pequeño príncipe que viene de otro planeta. A lo largo de su encuentro, el aviador escucha las aventuras del principito, quien ha viajado por varios planetas y ha conocido a diversos personajes, tales como un rey, un hombre de negocios, un farolero, un bebedor y un geógrafo. A través de estos encuentros, el principito aprende importantes lecciones sobre las relaciones humanas, el valor de la amistad y el amor.\r\n\r\nA través de los ojos del principito, el lector es invitado a reflexionar sobre la importancia de lo invisible, como lo es el amor y los sentimientos, frente a lo material y superficial. La obra es una alegoría que revela la crítica a la sociedad adulta y las prioridades que muchas veces se ponen en cosas que no son esenciales.\r\n\r\nLa relación entre el principito y una rosa, a la que considera única en el mundo, es uno de los símbolos más poderosos de la obra, representando el amor verdadero, que solo se comprende con el corazón.', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `book_genres`
--

CREATE TABLE `book_genres` (
  `book_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `book_genres`
--

INSERT INTO `book_genres` (`book_id`, `genre_id`) VALUES
(1, 1),
(1, 2),
(2, 73),
(2, 78),
(2, 80),
(2, 82);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `favoritos`
--

INSERT INTO `favoritos` (`user_id`, `book_id`) VALUES
(2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `genres`
--

INSERT INTO `genres` (`id`, `name`) VALUES
(74, 'Acción'),
(88, 'Arte'),
(71, 'Autoayuda'),
(73, 'Aventura'),
(70, 'Biografía'),
(84, 'Ciencia'),
(64, 'Ciencia Ficción'),
(89, 'Cocina'),
(77, 'Comedia'),
(90, 'Deportes'),
(76, 'Drama'),
(81, 'Ensayo'),
(65, 'Fantasía'),
(2, 'Ficción'),
(82, 'Filosofía'),
(69, 'Historia'),
(79, 'Infantil'),
(78, 'Juvenil'),
(80, 'Literatura Clásica'),
(66, 'Misterio'),
(91, 'Negocios'),
(72, 'Poesía'),
(92, 'Psicología'),
(1, 'Realismo mágico'),
(83, 'Religión'),
(67, 'Romance'),
(86, 'Salud'),
(75, 'Suspenso'),
(85, 'Tecnología'),
(68, 'Terror'),
(87, 'Viajes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'test', 'test@gmail.com', '$2b$10$XkHe3g8xHZpqok6MZopqI.XnQs52RW0M25GePhqZ155nDqWlsBsD2', 'user', '2025-07-22 01:52:09'),
(3, 'admin', 'admin@gmail.com', '$2b$10$XkHe3g8xHZpqok6MZopqI.XnQs52RW0M25GePhqZ155nDqWlsBsD2', 'admin', '2025-07-23 01:02:09');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `blacklisted_tokens`
--
ALTER TABLE `blacklisted_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `book_genres`
--
ALTER TABLE `book_genres`
  ADD PRIMARY KEY (`book_id`,`genre_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`user_id`,`book_id`),
  ADD KEY `fk_favoritos_book` (`book_id`);

--
-- Indices de la tabla `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `blacklisted_tokens`
--
ALTER TABLE `blacklisted_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `book_genres`
--
ALTER TABLE `book_genres`
  ADD CONSTRAINT `book_genres_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `fk_favoritos_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favoritos_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
