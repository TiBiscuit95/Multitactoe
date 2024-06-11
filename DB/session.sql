CREATE DATABASE IF NOT EXISTS nom_de_la_base;
USE nom_de_la_base;

-- -----------------------------------------------------
-- Table `joueur`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `joueur` (
  `id_joueur` INT NOT NULL AUTO_INCREMENT,
  `pseudo` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `e_mail` VARCHAR(45) NOT NULL,
  `partie_jouee` INT NOT NULL DEFAULT 0,
  `partie_perdue` INT NOT NULL DEFAULT 0,
  `match_nul` INT NOT NULL DEFAULT 0,
  `etat_actuel` VARCHAR(45) NOT NULL DEFAULT 'offline',
  PRIMARY KEY (`id_joueur`),
  UNIQUE INDEX `pseudo_UNIQUE` (`pseudo`),
  UNIQUE INDEX `e_mail_UNIQUE` (`e_mail`)
) ENGINE = InnoDB;
