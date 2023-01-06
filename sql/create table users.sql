CREATE TABLE users (
 	email TEXT,
    password TEXT,
    jwt TEXT,
    id serial PRIMARY KEY,
    userid TEXT,
    ipaddress TEXT,
    timecode BIGINT,
    name TEXT,
    latitude INT,
    longitude INT,
    location TEXT,
    likes TEXT[],
    birthday INT,
    monthofbirth INT,
    yearofbirth INT,
    growth INT,
    weight INT,
    gender INT,
    gendervapor INT,
    photomain INT,
    photolink TEXT[],
    signzodiac INT,
    education INT,
    fieldofactivity INT,
    maritalstatus INT,
    children INT,
    religion INT,
    smoke INT,
    alcohol INT,
    discription TEXT,
    profit INT,
    interests TEXT[],
    filters JSON,
    ilikecharacter INT[],
    idontlikecharacter INT[],
    raiting INT,
    cash INT,
    acctype TEXT,
    visit JSON[]
);

CREATE TABLE filters (
    id serial PRIMARY KEY,
    location VARCHAR(255),
    agestart INT,
    ageend INT,
    growthstart INT,
    growthend INT,
    weight INT,
    signzodiac INT,
    gendervapor INT,
    religion INT,
    smoke INT,
    alcohol INT,
    interests TEXT[]
);

CREATE TABLE bots (
    id serial PRIMARY KEY,
    type VARCHAR(255),
    discription VARCHAR(255),
    nmodel VARCHAR(255),
);

CREATE TABLE dialogs (
    id serial PRIMARY KEY,
    userid1 TEXT,
    userid2 TEXT,
    timecode BIGINT,
    dck TEXT,
    messages JSON[]
);

CREATE TABLE users_statistics (
    id serial PRIMARY KEY,
    visit JSON[]
);
