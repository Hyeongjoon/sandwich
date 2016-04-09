DROP DATABASE IF exists sandwich;
CREATE DATABASE sandwich DEFAULT CHARACTER SET utf8;


use sandwich;


SET foreign_key_checks = 0;


	DROP TABLE IF exists account;
create table account
		(nickname        VARCHAR(20)  NOT NULL,
	     email       VARCHAR(30)      NOT NULL,
		password    VARCHAR(30)        NOT NULL,
        language  VARCHAR(30)   NOT NULL,
        page_language VARCHAR(255) NOT NULL , 
        prohibit_account VARCHAR (255) default '',
        interesting_city VARCHAR (255) default '',
        facebook boolean default false,
        kakaotalk boolean default false,
        naver boolean default false,
        phone_check boolean default false,
        primary key (email),
        UNIQUE (nickname)
)Engine =InnoDB DEFAULT CHARSET = utf8;



        DROP TABLE IF exists sand;
create table sand (
		id int unsigned NOT NULL  AUTO_INCREMENT,
        nick varchar(20) NOT NULL,
        en_address varchar(50) NOT NULL,
        ko_address varchar(50) NOT NULL,
        geocode varchar(50) NOT NULL,
        contents  text  NOT NULL,
        image MEDIUMBLOB default NULL,
        language varchar(30) NOT NULL,
		start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        updated_time DATETIME default now(),
        activated boolean default true,
         primary key (id),
         foreign key(nick) references account(nickname) ON DELETE CASCADE ON UPDATE CASCADE
)Engine =InnoDB DEFAULT CHARSET = utf8;



	DROP TABLE IF exists sand_reply;
create table sand_reply (
	sand_id int unsigned NOT NULL,
    reply_id varchar(200) NOT NULL,
    reply_nick varchar(20) NOT NULL,
    contents  varchar(255)  NOT NULL,
    deleted boolean default false,
    created_time DATETIME default now(),
    updated_time DATETIME default now(),
    foreign key(sand_id) references sand(id) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(reply_nick) references account(nickname) ON DELETE CASCADE ON UPDATE CASCADE
)Engine =InnoDB DEFAULT CHARSET = utf8;



	DROP TABLE IF exists sand_reply_reply;
create table sand_reply_reply (
	sand_id int unsigned NOT NULL,
    reply_id varchar(200) NOT NULL,
    reply_nick varchar(20) NOT NULL,
    contents  varchar(255)  NOT NULL,
    deleted boolean default false,
    created_time DATETIME default now(),
    updated_time DATETIME default now(),
    foreign key(sand_id) references sand(id) ON DELETE CASCADE ON UPDATE CASCADE,
    foreign key(reply_nick) references account(nickname) ON DELETE CASCADE ON UPDATE CASCADE
)Engine =InnoDB DEFAULT CHARSET = utf8;



	DROP TABLE IF exists tour_guide_user;
create table tour_guide_user (
	guide_nick varchar(20) NOT NULL,
	guide_email varchar(30) NOT NULL,
	phone_number varchar(20) NOT NULL,
	foreign key(guide_nick) references account(nickname) ON DELETE CASCADE ON UPDATE CASCADE,
	foreign key(guide_email) references account(nickname) ON DELETE CASCADE ON UPDATE CASCADE
)Engine =InnoDB DEFAULT CHARSET = utf8;
    

    
	DROP TABLE IF exists tour_guide_user_scoring;
create table tour_guide_user_scoring (
	guide_nick varchar(20) NOT NULL,
	contents  varchar(255)  NOT NULL,
	user_score float(4,2) NOT NULL default 0,
	foreign key(guide_nick) references tour_guide_user(guide_nick) ON DELETE CASCADE ON UPDATE CASCADE
)Engine =InnoDB DEFAULT CHARSET = utf8;



	DROP TABLE IF exists tour_platform;
create table tour_platform (
	id int unsigned NOT NULL  AUTO_INCREMENT,
    guide_nick varchar(20) NOT NULL,
    en_address varchar(50) NOT NULL,
    ko_address varchar(50) NOT NULL,
	geocode varchar(50) NOT NULL,
    contents  text  NOT NULL,
	image MEDIUMBLOB default NULL,
    updated_time DATETIME default now(),
    activated boolean default true,
    start_date DATE NOT NULL,
	end_date DATE NOT NULL,
    language varchar(30) NOT NULL,
    primary key(id),
    foreign key(guide_nick) references tour_guide_user(guide_nick) ON DELETE CASCADE ON UPDATE CASCADE
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


 SET foreign_key_checks = 1;