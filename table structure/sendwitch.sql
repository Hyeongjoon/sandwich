DROP DATABASE IF exists sendwitch;
CREATE DATABASE sendwitch;

use sendwitch;


SET foreign_key_checks = 0;


DROP TABLE IF exists account;
create table account
		(nickname        VARCHAR(20)  NOT NULL,
	     email       VARCHAR(30)      NOT NULL,
		password    VARCHAR(30)        NOT NULL,
        default_language  VARCHAR(30)   NOT NULL,
        addtional_language  VARCHAR(255) default '',
        page_language VARCHAR(255) NOT NULL , 
        prohibit_account VARCHAR (255) default '',
        interesting_city_code VARCHAR (255) default '',
        facebook boolean default false,
        primary key (email),
        UNIQUE (nickname)
)Engine =InnoDB DEFAULT CHARSET = utf8;



        DROP TABLE IF exists sand;
create table sand (
		id int unsigned NOT NULL  AUTO_INCREMENT,
        nick varchar(20) NOT NULL,
        city_code MEDIUMINT unsigned NOT NULL,
        contents  text  NOT NULL,
        image MEDIUMBLOB default NULL,
        language varchar(30) NOT NULL,
		start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        updated_time DATETIME default now(),
        activated boolean default true,
         primary key (id),
         foreign key(nick) references account(nickname) ON DELETE CASCADE ON UPDATE CASCADE,
         foreign key(city_code) references town(city_id) ON DELETE CASCADE ON UPDATE CASCADE
)Engine =InnoDB DEFAULT CHARSET = utf8;


         
DROP TABLE IF exists chat_room;
create table chat_room (
		room_number int unsigned NOT NULL  AUTO_INCREMENT,
        nick1 varchar(20),
        nick2 varchar(20),
        nick1_alram tinyint unsigned default 0,
        nick2_alram tinyint unsigned default 0,
        nick1_deleted_time datetime default null,
        nick1_deleted boolean NOT null default false,
        nick2_deleted_time datetime default null,
        nick2_deleted boolean NOT null default false,
        updated_time datetime NOT NULL default now(),
			primary key(room_number),
            foreign key(nick1) references account(nickname) ON DELETE set null ON UPDATE CASCADE,
            foreign key(nick2) references account(nickname) ON DELETE set null ON UPDATE CASCADE
)Engine =InnoDB DEFAULT CHARSET = utf8;



DROP TABLE IF exists chat_log;
create table chat_log (
		room_number int unsigned NOT NULL,
        from_user varchar(20),
        to_user varchar(20),
        log_text varchar(7000),
        sended_time datetime NOT NULL default now(),
            foreign key(from_user) references account(nickname) ON DELETE set null ON UPDATE CASCADE,
            foreign key(to_user) references account(nickname) ON DELETE set null ON UPDATE CASCADE,
            foreign key(room_number) references chat_room(room_number) ON DELETE CASCADE ON UPDATE CASCADE
)Engine =InnoDB DEFAULT CHARSET = utf8;



DROP TABLE IF exists town;         
create table town (
		city_id MEDIUMINT unsigned NOT NULL AUTO_INCREMENT,
        english_city_name varchar(30) NOT NULL,
        country_code varchar(30) NOT NULL,
        primary key(city_id),
         UNIQUE (english_city_name),
         foreign key(country_code) references country_name(country_code) ON DELETE CASCADE ON UPDATE CASCADE
)Engine =InnoDB DEFAULT CHARSET = utf8;
        
        
        
DROP TABLE IF exists country_name;         
create table country_name(
	country_code varchar(30) NOT NULL,
    english_country_name varchar(30) NOT NULL,
    primary key(country_code),
    unique (english_country_name)
)Engine =InnoDB DEFAULT CHARSET = utf8;

 SET foreign_key_checks = 1;