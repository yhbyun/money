-- -----------------------------------------------------
-- Database `moneybook`
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `moneybook` DEFAULT CHARACTER SET utf8;

-- -----------------------------------------------------
-- Table `moneybook`.`members`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `moneybook`.`members` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(20) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `is_admin` TINYINT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `moneybook`.`moneybooks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `moneybook`.`moneybooks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `member_id` INT NOT NULL,
  `item` VARCHAR(100) NOT NULL,
  `amount` INT NOT NULL,
  `outlay_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_memberID`
    FOREIGN KEY (`member_id`)
    REFERENCES `moneybook`.`members` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
