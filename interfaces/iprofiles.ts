export interface IProfile {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    location: string,
    likes: [],
    age: number,
    birthday: number,
    monthofbirth: number,
    yearofbirth: number,
    gender: number,
    gendervapor: number,
    photomain: number,
    photolink: [],
    signzodiac: number,
    education: number,
    fieldofactivity: number,
    maritalstatus: number,
    children: number,
    religion: number,
    rise: number,
    smoke: number,
    alcohol: number,
    discription: string,
    profit: number,
    interests: [],
    ilikecharacter: [],
    idontlikecharacter: [],
    vapors: [],
    likepeople: [],
    dislikepeople: [],  
}

interface IFilterUsers {
    location: string,
    signzodiac: number,
    agestart: number,
    ageend: number,
    gendervapor: number,
    religion: number,
    smoke: number,
    alcohol: number,
}

export interface IQueryGetProfiles {
    jwt: string;
    id: number;
    startcount: number, 
    amount: number, 
    filters: IFilterUsers,
}

export interface IQueryGetProfile {
    jwt: string;
    id: number;
}

export interface IRegistration {
    gender: number,
    gendervapor: number,
    name: string,
    email: string,
    password: string,
}
