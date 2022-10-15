CREATE TABLE users (
 	email VARCHAR(255),
    password VARCHAR(255),
    jwt VARCHAR(255),
    id serial PRIMARY KEY,
    ipaddress VARCHAR(50),
    timecode INT,
    name VARCHAR(50),
    latitude INT,
    longitude INT,
    location VARCHAR(255),
    likes INT[],
    age INT,
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
    discription VARCHAR(255),
    profit INT,
    interests TEXT[],
    ilikecharacter INT[],
    idontlikecharacter INT[],
    cash INT
);

CREATE TABLE filters (
    id serial PRIMARY KEY,
    location VARCHAR(255),
    agestart INT,
    ageend INT,
    growthstart INT,
    growthend INT,
    weightstart INT,
    weightend INT,
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

CREATE TABLE messages (
    id serial PRIMARY KEY,
    id1 INT,
    id2 INT,
    timecode INT,
    dck VARCHAR(255),
    messages TEXT[]
);
