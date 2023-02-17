CREATE TABLE users (
 	email TEXT,
    password TEXT,
    jwt TEXT,
    id serial PRIMARY KEY,
    userid TEXT,
    coordinates JSON[],
    registrationdate BIGINT,
    timecode BIGINT,
    name TEXT,
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
    stickerpacks TEXT[], 
    rating INT,
    cash INT,
    acctype TEXT,
    banned JSON,
    visit JSON[]
);

CREATE TABLE bots (
    id serial PRIMARY KEY,
    type TEXT,
    discription TEXT,
    nmodel TEXT,
);

CREATE TABLE dialogs (
    id serial PRIMARY KEY,
    userid1 TEXT,
    userid2 TEXT,
    timecode BIGINT,
    dck TEXT,
    messages JSON[]
);

CREATE TABLE stickers (
    id serial PRIMARY KEY,
    idstickerpack TEXT,
    name TEXT,
    discription TEXT,
    price INT, 
    author TEXT,
    stickers JSON[]
);

CREATE TABLE shop (
    id serial PRIMARY KEY,
    ratingtariffs JSON[]
);
