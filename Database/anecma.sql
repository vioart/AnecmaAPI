-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 16, 2024 at 08:01 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `anecma`
--

-- --------------------------------------------------------

--
-- Table structure for table `Account`
--

CREATE TABLE `Account` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Account`
--

INSERT INTO `Account` (`id`, `user_id`, `provider`, `access_token`, `expires_at`, `created_at`) VALUES
(1, 8, 'google', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJ2aW9hcnRkZXZlbG9wZXJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjYzMTEyNTQsImV4cCI6MTcyODgxNjg1NH0.t_0qf1hZKFpELAJA3zVpen2l8p6i0S7JuAW54-KvqHQ', '2024-10-13 17:54:14', '2024-09-14 17:54:14'),
(2, 9, 'google', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJmaXlhQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI2NDc0NzI1LCJleHAiOjE3Mjg5ODAzMjV9.kC6ACnWRgGsTML4QwlHFu_dUJzfFQqkwx6IFTrqXn4s', '2024-10-15 15:18:45', '2024-09-16 15:18:45'),
(3, 9, 'google', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpeWFAZ21haWwuY29tIiwicm9sZSI6InBldHVnYXMiLCJpYXQiOjE3MjY0NzYyMTgsImV4cCI6MTcyODk4MTgxOH0.Xt0pS5aXyXQ_TIz3QgxPKVJaycSaz-9WQvHTdoUlZZE', '2024-10-15 15:43:39', '2024-09-16 15:43:39'),
(4, 9, 'google', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpeWFAZ21haWwuY29tIiwicm9sZSI6InBldHVnYXMiLCJpYXQiOjE3MjY0NzYyODksImV4cCI6MTcyODk4MTg4OX0.O-s-JgogTFKAyIPBts_6o3vEa7AOns016LysVh7Ltio', '2024-10-15 15:44:49', '2024-09-16 15:44:49'),
(6, 12, 'google', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InpvZUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcyNjQ3ODAzNSwiZXhwIjoxNzI4OTgzNjM1fQ.DjAeBErhpm7tUBFDuVIzd8Z41SEf280Shht6_fvgp8s', '2024-10-15 16:13:55', '2024-09-16 16:13:55');

-- --------------------------------------------------------

--
-- Table structure for table `CekHB`
--

CREATE TABLE `CekHB` (
  `cek_hb_id` int(11) NOT NULL,
  `ibu_hamil_id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nilai_hb` float NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `CekHB`
--

INSERT INTO `CekHB` (`cek_hb_id`, `ibu_hamil_id`, `tanggal`, `nilai_hb`, `created_at`) VALUES
(1, 1, '2024-09-15', 15, '2024-09-15 13:23:55'),
(2, 1, '2024-09-15', 11, '2024-09-15 13:25:13');

-- --------------------------------------------------------

--
-- Table structure for table `Edukasi`
--

CREATE TABLE `Edukasi` (
  `edukasi_id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `konten` text NOT NULL,
  `jenis` varchar(255) NOT NULL,
  `kategori` varchar(255) NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Edukasi`
--

INSERT INTO `Edukasi` (`edukasi_id`, `judul`, `konten`, `jenis`, `kategori`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Ibu Hamil', 'asdh sadshajdh sadg', 'Kesehatan', 'Kesehatan', '1', '2024-09-16 16:43:02', '2024-09-16 16:43:02');

-- --------------------------------------------------------

--
-- Table structure for table `IbuHamil`
--

CREATE TABLE `IbuHamil` (
  `ibu_hamil_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `usia` int(11) DEFAULT NULL,
  `no_hp` varchar(255) DEFAULT NULL,
  `hari_pertama_haid` date DEFAULT NULL,
  `tempat_tinggal_ktp` varchar(255) DEFAULT NULL,
  `tempat_tinggal_kelurahan` varchar(255) DEFAULT NULL,
  `pendidikan_terakhir` varchar(255) DEFAULT NULL,
  `pekerjaan` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `nama_suami` varchar(255) DEFAULT NULL,
  `no_hp_suami` varchar(255) DEFAULT NULL,
  `email_suami` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `IbuHamil`
--

INSERT INTO `IbuHamil` (`ibu_hamil_id`, `user_id`, `nama`, `usia`, `no_hp`, `hari_pertama_haid`, `tempat_tinggal_ktp`, `tempat_tinggal_kelurahan`, `pendidikan_terakhir`, `pekerjaan`, `image`, `nama_suami`, `no_hp_suami`, `email_suami`, `created_at`, `updated_at`) VALUES
(1, 8, 'Della', 22, '082132355412', '2024-08-10', 'Pasar Kliwor, Solo', 'Solo', 'S1', 'Asisten', NULL, 'Zen', '628462384624', 'zen@gmail.com', '2024-09-14 17:54:14', '2024-09-14 17:54:14');

-- --------------------------------------------------------

--
-- Table structure for table `JurnalMakan`
--

CREATE TABLE `JurnalMakan` (
  `jurnal_makan_id` int(11) NOT NULL,
  `ibu_hamil_id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `sarapan_karbohidrat` int(11) NOT NULL,
  `sarapan_lauk_hewani` int(11) NOT NULL,
  `sarapan_lauk_nabati` int(11) NOT NULL,
  `sarapan_sayur` int(11) NOT NULL,
  `sarapan_buah` int(11) NOT NULL,
  `makan_siang_karbohidrat` int(11) NOT NULL,
  `makan_siang_lauk_hewani` int(11) NOT NULL,
  `makan_siang_lauk_nabati` int(11) NOT NULL,
  `makan_siang_sayur` int(11) NOT NULL,
  `makan_siang_buah` int(11) NOT NULL,
  `makan_malam_karbohidrat` int(11) NOT NULL,
  `makan_malam_lauk_hewani` int(11) NOT NULL,
  `makan_malam_lauk_nabati` int(11) NOT NULL,
  `makan_malam_sayur` int(11) NOT NULL,
  `makan_malam_buah` int(11) NOT NULL,
  `total_kalori` float NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `JurnalMakan`
--

INSERT INTO `JurnalMakan` (`jurnal_makan_id`, `ibu_hamil_id`, `tanggal`, `sarapan_karbohidrat`, `sarapan_lauk_hewani`, `sarapan_lauk_nabati`, `sarapan_sayur`, `sarapan_buah`, `makan_siang_karbohidrat`, `makan_siang_lauk_hewani`, `makan_siang_lauk_nabati`, `makan_siang_sayur`, `makan_siang_buah`, `makan_malam_karbohidrat`, `makan_malam_lauk_hewani`, `makan_malam_lauk_nabati`, `makan_malam_sayur`, `makan_malam_buah`, `total_kalori`, `created_at`) VALUES
(5, 1, '2024-09-15', 100, 1, 1, 3, 2, 4, 6, 3, 7, 3, 2, 3, 4, 4, 2, 20.37, '2024-09-15 13:05:20'),
(6, 1, '2024-09-15', 100, 1, 1, 3, 2, 4, 6, 3, 7, 3, 2, 3, 4, 4, 2, 20.37, '2024-09-15 13:05:45'),
(7, 1, '2024-09-15', 300, 1, 1, 3, 2, 4, 6, 3, 7, 3, 2, 3, 4, 4, 2, 20.37, '2024-09-15 13:06:15'),
(8, 1, '2024-09-15', 900, 1, 1, 3, 2, 4, 6, 3, 7, 3, 2, 3, 4, 4, 2, 20.37, '2024-09-15 13:07:13');

-- --------------------------------------------------------

--
-- Table structure for table `KonsumsiTTD`
--

CREATE TABLE `KonsumsiTTD` (
  `konsumsi_ttd_id` int(11) NOT NULL,
  `ibu_hamil_id` int(11) NOT NULL,
  `tanggal_waktu` datetime NOT NULL,
  `minum_vit_C` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `KonsumsiTTD`
--

INSERT INTO `KonsumsiTTD` (`konsumsi_ttd_id`, `ibu_hamil_id`, `tanggal_waktu`, `minum_vit_C`, `created_at`) VALUES
(1, 1, '2024-09-15 13:13:19', 1, '2024-09-15 13:13:19'),
(2, 1, '2024-09-15 13:13:51', 0, '2024-09-15 13:13:51');

-- --------------------------------------------------------

--
-- Table structure for table `PetugasPuskesmas`
--

CREATE TABLE `PetugasPuskesmas` (
  `petugas_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `puskesmas_id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `no_hp` varchar(255) NOT NULL,
  `jabatan` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `PetugasPuskesmas`
--

INSERT INTO `PetugasPuskesmas` (`petugas_id`, `user_id`, `puskesmas_id`, `nama`, `no_hp`, `jabatan`, `image`, `created_at`, `updated_at`) VALUES
(1, 9, 1, 'Susi', '0823423465', 'Perawat', 'susi.jpg', '2024-09-16 10:45:48', '2024-09-16 10:45:48'),
(2, 12, 2, 'Zoe Putri', '0864326434', 'Dokter', 'zoe.jpg', '2024-09-16 16:18:47', '2024-09-16 16:21:07');

-- --------------------------------------------------------

--
-- Table structure for table `Puskesmas`
--

CREATE TABLE `Puskesmas` (
  `puskesmas_id` int(11) NOT NULL,
  `nama_puskesmas` varchar(255) NOT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `kecamatan` varchar(255) DEFAULT NULL,
  `no_hp` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Puskesmas`
--

INSERT INTO `Puskesmas` (`puskesmas_id`, `nama_puskesmas`, `alamat`, `kecamatan`, `no_hp`, `created_at`, `updated_at`) VALUES
(1, 'jebres', 'jebres, solo', 'jebres', '023184144', '2024-09-16 14:16:39', '2024-09-16 14:16:39'),
(2, 'Puskesmas Laweyan', 'Laweyan, Solo', 'Laweyan', '0236453123', '2024-09-16 15:58:01', '2024-09-16 16:01:13');

-- --------------------------------------------------------

--
-- Table structure for table `ReminderTTD`
--

CREATE TABLE `ReminderTTD` (
  `reminder_id` int(11) NOT NULL,
  `ibu_hamil_id` int(11) NOT NULL,
  `waktu_reminder_1` time NOT NULL,
  `is_active_reminder_1` int(11) NOT NULL,
  `waktu_reminder_2` time NOT NULL,
  `is_active_reminder_2` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ReminderTTD`
--

INSERT INTO `ReminderTTD` (`reminder_id`, `ibu_hamil_id`, `waktu_reminder_1`, `is_active_reminder_1`, `waktu_reminder_2`, `is_active_reminder_2`, `created_at`, `updated_at`) VALUES
(1, 1, '02:30:45', 0, '07:15:30', 1, '2024-09-15 13:44:27', '2024-09-15 13:54:14');

-- --------------------------------------------------------

--
-- Table structure for table `ResikoAnemia`
--

CREATE TABLE `ResikoAnemia` (
  `resiko_anemia_id` int(11) NOT NULL,
  `ibu_hamil_id` int(11) NOT NULL,
  `usia_kehamilan` int(11) NOT NULL,
  `jumlah_anak` int(11) NOT NULL,
  `riwayat_anemia` int(11) NOT NULL,
  `konsumsi_ttd_7hari` int(11) NOT NULL,
  `hasil_hb` float NOT NULL,
  `resiko` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ResikoAnemia`
--

INSERT INTO `ResikoAnemia` (`resiko_anemia_id`, `ibu_hamil_id`, `usia_kehamilan`, `jumlah_anak`, `riwayat_anemia`, `konsumsi_ttd_7hari`, `hasil_hb`, `resiko`, `created_at`) VALUES
(8, 1, 22, 4, 1, 2, 1.5, 'Rendah', '2024-09-15 12:55:25');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`user_id`, `email`, `role`, `created_at`, `updated_at`) VALUES
(8, 'vioartdeveloper@gmail.com', 'user', '2024-09-14 17:54:14', '2024-09-14 17:54:14'),
(9, 'fiya@gmail.com', 'petugas', '2024-09-16 15:18:45', '2024-09-16 15:18:45'),
(12, 'zoe@gmail.com', 'user', '2024-09-16 16:13:54', '2024-09-16 16:13:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Account`
--
ALTER TABLE `Account`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `CekHB`
--
ALTER TABLE `CekHB`
  ADD PRIMARY KEY (`cek_hb_id`),
  ADD KEY `ibu_hamil_id` (`ibu_hamil_id`);

--
-- Indexes for table `Edukasi`
--
ALTER TABLE `Edukasi`
  ADD PRIMARY KEY (`edukasi_id`);

--
-- Indexes for table `IbuHamil`
--
ALTER TABLE `IbuHamil`
  ADD PRIMARY KEY (`ibu_hamil_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `JurnalMakan`
--
ALTER TABLE `JurnalMakan`
  ADD PRIMARY KEY (`jurnal_makan_id`),
  ADD KEY `ibu_hamil_id` (`ibu_hamil_id`);

--
-- Indexes for table `KonsumsiTTD`
--
ALTER TABLE `KonsumsiTTD`
  ADD PRIMARY KEY (`konsumsi_ttd_id`),
  ADD KEY `ibu_hamil_id` (`ibu_hamil_id`);

--
-- Indexes for table `PetugasPuskesmas`
--
ALTER TABLE `PetugasPuskesmas`
  ADD PRIMARY KEY (`petugas_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `puskesmas_id` (`puskesmas_id`);

--
-- Indexes for table `Puskesmas`
--
ALTER TABLE `Puskesmas`
  ADD PRIMARY KEY (`puskesmas_id`);

--
-- Indexes for table `ReminderTTD`
--
ALTER TABLE `ReminderTTD`
  ADD PRIMARY KEY (`reminder_id`),
  ADD KEY `ibu_hamil_id` (`ibu_hamil_id`);

--
-- Indexes for table `ResikoAnemia`
--
ALTER TABLE `ResikoAnemia`
  ADD PRIMARY KEY (`resiko_anemia_id`),
  ADD UNIQUE KEY `unique_ibu_hamil` (`ibu_hamil_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Account`
--
ALTER TABLE `Account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `CekHB`
--
ALTER TABLE `CekHB`
  MODIFY `cek_hb_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Edukasi`
--
ALTER TABLE `Edukasi`
  MODIFY `edukasi_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `IbuHamil`
--
ALTER TABLE `IbuHamil`
  MODIFY `ibu_hamil_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `JurnalMakan`
--
ALTER TABLE `JurnalMakan`
  MODIFY `jurnal_makan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `KonsumsiTTD`
--
ALTER TABLE `KonsumsiTTD`
  MODIFY `konsumsi_ttd_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `PetugasPuskesmas`
--
ALTER TABLE `PetugasPuskesmas`
  MODIFY `petugas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Puskesmas`
--
ALTER TABLE `Puskesmas`
  MODIFY `puskesmas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ReminderTTD`
--
ALTER TABLE `ReminderTTD`
  MODIFY `reminder_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ResikoAnemia`
--
ALTER TABLE `ResikoAnemia`
  MODIFY `resiko_anemia_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Account`
--
ALTER TABLE `Account`
  ADD CONSTRAINT `Account_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

--
-- Constraints for table `CekHB`
--
ALTER TABLE `CekHB`
  ADD CONSTRAINT `CekHB_ibfk_1` FOREIGN KEY (`ibu_hamil_id`) REFERENCES `IbuHamil` (`ibu_hamil_id`);

--
-- Constraints for table `IbuHamil`
--
ALTER TABLE `IbuHamil`
  ADD CONSTRAINT `IbuHamil_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

--
-- Constraints for table `JurnalMakan`
--
ALTER TABLE `JurnalMakan`
  ADD CONSTRAINT `JurnalMakan_ibfk_1` FOREIGN KEY (`ibu_hamil_id`) REFERENCES `IbuHamil` (`ibu_hamil_id`);

--
-- Constraints for table `KonsumsiTTD`
--
ALTER TABLE `KonsumsiTTD`
  ADD CONSTRAINT `KonsumsiTTD_ibfk_1` FOREIGN KEY (`ibu_hamil_id`) REFERENCES `IbuHamil` (`ibu_hamil_id`);

--
-- Constraints for table `PetugasPuskesmas`
--
ALTER TABLE `PetugasPuskesmas`
  ADD CONSTRAINT `PetugasPuskesmas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  ADD CONSTRAINT `PetugasPuskesmas_ibfk_2` FOREIGN KEY (`puskesmas_id`) REFERENCES `Puskesmas` (`puskesmas_id`);

--
-- Constraints for table `ReminderTTD`
--
ALTER TABLE `ReminderTTD`
  ADD CONSTRAINT `ReminderTTD_ibfk_1` FOREIGN KEY (`ibu_hamil_id`) REFERENCES `IbuHamil` (`ibu_hamil_id`);

--
-- Constraints for table `ResikoAnemia`
--
ALTER TABLE `ResikoAnemia`
  ADD CONSTRAINT `ResikoAnemia_ibfk_1` FOREIGN KEY (`ibu_hamil_id`) REFERENCES `IbuHamil` (`ibu_hamil_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
