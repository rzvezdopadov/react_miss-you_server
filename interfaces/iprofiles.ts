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
    growth: number,
    weight:number,   
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
}

interface IFilterUsers {
    location: string,
    signzodiac: number,
    agestart: number,
    ageend: number,
    growthstart: number,
    growthend: number,
    weightstart: number,
    weightend: number,
    gendervapor: number,
    religion: number,
    smoke: number,
    alcohol: number,
    interests: [],
}

export interface IQueryGetProfiles {
    jwt: string;
    id: number;
    startcount: number, 
    amount: number, 
    filters: IFilterUsers,
    users: string
}

export interface IGetProfiles {
    jwt: string;
    id: number;
    startcount: number, 
    amount: number, 
    filters: IFilterUsers,
    users: []
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
