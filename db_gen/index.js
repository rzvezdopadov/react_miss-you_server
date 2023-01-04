const Person = {
    email: '1@gmail.com',
    password: '$2a$13$Wzt2dof.s0RbuojuKcsKc.TqKvpcShQo4tKGm.7VaC6LbBJDsS6ey', // 123456789
    jwt: '',
    userid: 1,
    ipaddress: '0.0.0.0',
    timecode: 0,
    name: 'Eva',
    latitude: 0,
    longitude: 0,
    location: 'Россия, Рязанская область, г.Рязань',
    likes: [],
    age: 22,
    birthday: 5,
    monthOfBirth: 5,
    yearOfBirth: 2000,
    gender: 1,
    genderVapor: 0,
    photoMain: 1,
    photoLink: [],
    signZodiac: 5,
    education: 2,
    fieldOfActivity: 1,
    maritalStatus: 0,
    children: 2,
    religion: 0,
    rise: 2,
    smoke: 1,
    alcohol: 1,
    discription: 'Приветики, меня зовут Ева',
    profit: 2,
    interests: [],
    iLikeСharacter: [],
    iDontLikeСharacter: [],
    raiting: 100,
    cash: 0,
    filters: {
        location: 'Россия, Рязанская область, г.Рязань',
        agestart: 18,
        ageend: 50,
        growthstart: 120,
        growthend: 180,
        weight: 0,
        signzodiac: 0,
        gendervapor: 0,
        religion: 0,
        smoke: 0,
        alcohol: 0,
        interests: [],
    }
}

const namesWoman = [
    'Абигейл', 'Аделаида', 'Аделин', 'Адель', 'Адриана', 'Айлин', 'Бренда', 'Бриана', 'Ванесса', 'Виола', 
    'Габриэлла', 'Гленн', 'Грейс', 'Грета', 'Дебора', 'Дженна', 'Вирджиния', 'Джессика', 'Джозефина', 'Джулия', 
    'Доминика', 'Дорис', 'Дороти', 'Идэн', 'Изабелла', 'Изикиэл', 'Каролин', 'Кейт', 'Клер', 'Кэролин', 
    'Лайза', 'Лаура', 'Леа', 'Лиза', 'Кэнди', 'Кэт', 'Кэтрин', 'Лайла', 'Лили', 'Линда', 
    'Люси', 'Лаурен', 'Лиллиан', 'Майя', 'Мара', 'Маргарет', 'Марта', 'Миранда', 'Молли', 'Мэг', 
    'Мэрилин', 'Наоми', 'Натаниэль', 'Ниа', 'Николь', 'Нора', 'Нэнси', 'Одри', 'Оливия', 'Офелия', 
    'Палмер', 'Памела', 'Патрисия', 'Пегги', 'Пейтон', 'Пенелопа', 'Ребекка', 'Реджина', 'Риана', 'Рикарда', 
    'Рита', 'Розмари', 'Роуз', 'Рут', 'Рэйчел', 'Сабрина', 'Сания', 'Сильвия', 'Скарлетт', 'Стелла', 
    'Сью', 'Сэнди', 'Стефани', 'Сьюзан', 'Сидни', 'Сара', 'Сандра', 'Саманта', 'Тереза', 'Тифани',
    'Тринити', 'Флоренс', 'Фрэнсис', 'Фрида', 'Ханна', 'Харпер', 'Хелен', 'Хилари', 'Хлоя', 'Холли', 
    'Челси', 'Хезер', 'Хизер', 'Шанель', 'Шейла', 'Шерил', 'Ширли', 'Шэрон', 'Шарлотта', 'Шелли',
];

const namesMan = [
    'Адам', 'Айдан', 'Айзек', 'Алекс', 'Альберт', 'Арчер', 'Бадди', 'Барни', 'Бен', 'Бенджамин', 
    'Билл', 'Блейк', 'Боб', 'Брендон', 'Брук', 'Брюс', 'Вайолет', 'Вивиан', 'Винсент', 'Брэндон', 
    'Гарольд', 'Гарри', 'Говард', 'Грэг', 'Гэвин', 'Гэри', 'Давид', 'Джеймс', 'Дастин', 'Джексон', 
    'Джозеф', 'Джонатан', 'Зейн', 'Зэкери', 'Иаков', 'Ирвин', 'Итан', 'Итен', 'Калеб', 'Квентин', 
    'Кен', 'Коннор', 'Кристиан', 'Кристофер', 'Ллойд', 'Леон', 'Луис', 'Кларк', 'Марлон', 'Морган', 
    'Мэтью', 'Майкл', 'Николас', 'Ной', 'Норвуд', 'Натан', 'Марвин', 'Мелвин', 'Мэделин', 'Мэйсон', 
    'Олби', 'Оливер', 'Оскар', 'Оуэн', 'Остин', 'Пауль', 'Пол', 'Райан', 'Рейнольд', 'Рональд', 
    'Рэй', 'Рэймонд', 'Стэнфорд', 'Рэйлан', 'Спенсер', 'Роджер', 'Стивен', 'Себастиан', 'Теодор', 'Уинслоу', 
    'Уолтер', 'Скайлар', 'Сет', 'Самир', 'Саймон', 'Тони', 'Тумас', 'Томас', 'Тимоти', 'Тейлор', 
    'Сэм', 'Тим', 'Тодд', 'Сэмуэль', 'Тристан', 'Уильям', 'Франклин', 'Фрэнк', 'Харви', 'Чарльз', 
];

const surnames = [
    'Джонсон', 'Уильямс', 'Джонс', 'Браун', 'Дэвис', 'Миллер', 'Уилсон', 'Мур', 'Тейлор', 'Андерсон',
    'Томас', 'Джексон', 'Уайт', 'Смит', '', 'Харрис', 'Мартин', 'Томпсон', 'Гарсиа', 'Мартинес', 
    'Робинсон', 'Кларк', 'Родригес', 'Льюис', 'Холл', 'Уокер', 'Аллен', 'Янг', 'Эрнандес', 'Кинг', 
    'Райт', 'Лопес', 'Хилл', 'Скотт', 'Грин', 'Бейкер', 'Адамс', 'Гонсалес', 'Нельсон', 'Картер', 
    'Митчелл', 'Перес', 'Робертс', 'Тёрнер', 'Филлипс', 'Кэмпбелл', 'Паркер', 'Эванс', 'Эдвардс', 'Коллинз', 
];

const photoWoman = [
    'https://proprikol.ru/wp-content/uploads/2021/09/kartinki-krasivyh-zhenshhin-49.jpg', 
    'https://mixmag.io/wp-content/pics/104171/image118-480x720.jpg', 
    'https://mixmag.io/wp-content/pics/104171/image119-578x720.jpg', 
    'https://mixmag.io/wp-content/pics/104171/image113-1-720x720.jpg', 
    'https://medialeaks.ru/wp-content/uploads/2021/01/esyj8pjxyaio6om-1.jpg', 
    'https://vjoy.cc/wp-content/uploads/2021/02/52314005_1221634477993730_2692347061888502789_n.jpg', 
    'https://vjoy.cc/wp-content/uploads/2021/02/1234.jpg', 
    'https://funik.ru/wp-content/uploads/2018/11/503296085e8dc5cb9b18-700x877.jpg',
    'https://basetop.ru/wp-content/uploads/2020/09/1.jpg',
    'https://cdn.trinixy.ru/pics5/20120410/over_50_47.jpg',
    'https://demotivation.ru/wp-content/uploads/2021/02/oshibki-makiyazha.jpg',
    'https://proprikol.ru/wp-content/uploads/2019/06/kartinki-krasivyh-zhenshhin-3.jpg',
    'https://www.buro247.ua/thumb/670x830_0/images/2019/08/highest-paid-actresses-2019-01.png',
    'https://art-assorty.ru/uploads/posts/2017-07/1499855062_amanda-seyfrid.jpg',
    'https://modelnyeagentstva.com/sites/default/files/modelnoe-agentstvo/5-7/b888711ad4ae.jpg',
    'https://basetop.ru/wp-content/uploads/2021/09/samye-krasivye-aktrisy-696x392.jpg',
];

const photoMan = [
    'http://img.viva.ua/pictures/uploads/images/GettyImages-645743256.jpg',
    'https://www.peoples.ru/images/interesting/interesting_201212100830524.jpg',
    'https://i.timeout.ru/pix/resize/496/654/750x485.png',
    'https://basetop.ru/wp-content/uploads/2012/07/image22.png',
    'https://wl-adme.cf.tsp.li/resize/728x/jpg/8aa/e38/ac17985a0cb4279b514763ffe6.jpg',
    'https://b1.filmpro.ru/c/384541.700xp.jpg',
    'https://www.kinometro.ru/res/pic/data/review/734.jpg',
    'https://wsjournal.ru/wp-content/uploads/2016/08/Evolyutsiya-Mark-Uolberg-1024x683-1024x576.jpg',
    'https://kupidonia.ru/content/lists/photo/big/595_1.jpg',
    'https://uznayvse.ru/images/stories/uzn_1396981256.jpeg',
    'https://ruafisha.ru/images/stories/5/69778_kris-pajn_or_chris-pine_1x1200_www.GdeFon.ru.jpg',
    'https://cdnn21.img.ria.ru/images/149835/48/1498354822_0:66:3000:1754_600x0_80_0_0_311e2d3a799cc2749586cffca988d39e.jpg',
    'https://n1s1.elle.ru/9c/d9/48/9cd948702e8ae4fb1e458d3fa2949199/728x652_1_d7349508227fe27f1235b9577366711d@1000x896_0xd42ee42a_17073786291391672067.jpeg',
    'https://cdn.nur.kz/images/1120/606665fe752401c5.jpeg',
    'https://basetop.ru/wp-content/uploads/2021/09/samye-krasivye-aktery-696x392.jpg',
    'https://ruafisha.ru/images/stories/5/69778_kris-pajn_or_chris-pine_1x1200_www.GdeFon.ru.jpg',
];

const interests = [
    'Автомобили', 'Ароматерапия', 'Астрономия', 'Аэробика', 'Аэрография', 'Бадминтон', 'Батик', 'Батут',
    'Бег', 'Бильярд', 'Блоггерство', 'Бодиарт', 'Боевые искусства', 'Бонсай', 'Боулинг', 'Велосипед',
    'Видеомонтаж', 'Растения', 'Цветы', 'Вязание', 'Гербарий', 'Головоломки', 'Гольф', 'Горные лыжи',
    'Граффити', 'Дайвинг', 'Дартс', 'Декупаж', 'Диггерство', 'Дизайн интерьера', 'Дизайн одежды', 'Животные',
    'Жонглирование', 'Зентангл', 'Музыкальные инструменты', 'Игрушки и куклы', 'Игры', 'Кузнечное дело', 'Икебана', 'Кайтинг',
    'Каллиграфия', 'Карвинг', 'Картинг', 'Квесты', 'Кладоискательство', 'Коллекционирование', 'Компьютерная графика', 'Косплей',
    'Коньки', 'Ролики', 'Кроссворды', 'Кулинария', 'Лепка', 'Лошади', 'Лыжи', 'Массаж',
    'Моделирование', 'Музеи', 'Музыка', 'Мыловарение', 'Настолки', 'Оригами', 'Открытки', 'Охота',
    'Открытки', 'Паззлы', 'Паркур', 'Пение', 'Пейнтбол', 'Пилатес', 'Предпринимательство', 'Программирование',
    'Психология', 'Пчеловодство', 'Путешествия', 'Радиовещание', 'Рисование', 'Рыбалка', 'Серфинг', 'Скейтборд',
];

const hello = [
    'Привет', 'Приветики', 'Здравствуйте', 'Всем добра'
];

function genPos(count) {
    return Math.floor(Math.random() * count);
}

const arrPerson = []; 

const personId = 500;

for (let i=1; i<personId+1; i++) {
    const person = JSON.parse(JSON.stringify(Person));   
    person.email =  '' + i + '@gmail.com';
    person.userid =  i;
    person.gender = genPos(2); 
    
    if (person.gender === 1) { 
        if (!genPos(2)) {
            person.genderVapor = 0; 
        } else {
            person.genderVapor = 2; 
        }
    } else { 
        if (!genPos(2)) {
            person.genderVapor = 1;
        } else {
            person.genderVapor = 2; 
        }
    }
    
    const date = new Date();
    const timecode = date.getTime();
    person.timecode = timecode - genPos(10000000); 
    
    if (person.gender === 0) {
        person.name =  namesMan[genPos(namesMan.length)] + ' ' + surnames[genPos(surnames.length)];  
    } else {
        person.name =  namesWoman[genPos(namesWoman.length)] + ' ' + surnames[genPos(surnames.length)];  
    }

    function genUnical(arr) {
        const value = genPos(personId);
        if (arr.includes(value)) {
            genUnical(arr);
        } else {
            arr.push(String(value));
        }
    }
    
    for (let i=0; i < Math.floor(personId/10); i++) {
        genUnical(person.likes);
    }  
    
    person.age =  18 + genPos(20);
    
    person.birthday =  1 + genPos(27);
    person.monthOfBirth = 1 + genPos(11);
    person.yearOfBirth =  1980 + genPos(20);
    person.growth = 120 + genPos(80);
    person.weight = genPos(5);

    for (let j=0; j<2; j++) {
        let linkPhoto;

        if (person.gender === 0) {
            linkPhoto = photoMan[genPos(photoMan.length)];
        } else {
            linkPhoto = photoWoman[genPos(photoWoman.length)];
        }
    
        person.photoLink.push(linkPhoto);
    }
    
    for (let j=0; j<genPos(10); j++) {
        let linkPhoto;

        if (person.gender === 0) {
            linkPhoto = photoMan[genPos(photoMan.length)];
        } else {
            linkPhoto = photoWoman[genPos(photoWoman.length)];
        }
    
        person.photoLink.push(linkPhoto);
    }

    for (let j=0; j<genPos(10); j++) {
        person.interests.push(interests[genPos(interests.length)].toLowerCase());
    }

    person.signZodiac =  1 + genPos(10);
    person.education =  genPos(4);

    person.fieldOfActivity =  genPos(4);
    person.maritalStatus =  genPos(4);
    person.children =  genPos(4);
    person.religion =  genPos(4);
    person.alcohol =  genPos(2);
    person.smoke = genPos(2);
    person.discription = hello[genPos(hello.length)] + ', меня зовут ' + person.name;
    person.profit =  genPos(4);

    for (let j=0; j<genPos(10); j++) { person.iLikeСharacter.push(genPos(30)) }
    for (let j=0; j<genPos(10); j++) { person.iDontLikeСharacter.push(genPos(30)) }
    person.raiting =  genPos(10000);
    person.cash =  genPos(2000);

    person.filters.agestart = 18 + genPos(8);
    person.filters.agestart = person.filters.agestart + genPos(8);
    person.filters.growthstart = 120 + genPos(10);
    person.filters.growthend = person.filters.growthstart + genPos(50);
    person.filters.weight = genPos(5);
    person.filters.signzodiac = 1 + genPos(10);
    person.filters.gendervapor = person.genderVapor;
    person.filters.religion = genPos(4);
    person.filters.smoke = genPos(3);
    person.filters.alcohol = genPos(3);
    for (let j=0; j<genPos(10); j++) {
        person.filters.interests.push(interests[genPos(interests.length)].toLowerCase());
    }

    arrPerson.push(person);     
}

function arrQueryInt(str, arr) {
    if (arr.length === 0) {
        str += "ARRAY [] ::integer [], ";
    } else {
        str += "ARRAY [";
        
        for (let i = 0; i < arr.length; i++) {
            if (i === arr.length - 1) {
              str += "" + arr[i];      
            } else {
              str += "" + arr[i] + ", ";  
            }
        }
        
        str +=  "], ";
    }

    return str;
}

function arrQueryStr(str, arr) {       
    if (arr.length === 0) {
        str += "ARRAY [] ::TEXT [], ";
    } else {
        str += "ARRAY [";
        
        for (let i = 0; i < arr.length; i++) {
            if (i === arr.length - 1) {
              str += "'" + arr[i] + "'";      
            } else {
              str += "'" + arr[i] + "', ";  
            }
        }
        
        str +=  "], ";
    }
    
    return str;
}

const arrPersonQuery = arrPerson.map((item)=>{
    str = '';
    str += 'INSERT INTO public.users(';
	str += 'email, password, jwt, userid, ipaddress, timecode, name, latitude, longitude, location, ';
    str += 'likes, age, birthday, monthofbirth, yearofbirth, growth, weight, gender, ';
    str += 'gendervapor, photomain, photolink, signzodiac, education, ';
    str += 'fieldofactivity, maritalstatus, children, religion, ';
    str += 'smoke, alcohol, discription, profit, interests, filters, ilikecharacter, ';
    str += 'idontlikecharacter, raiting, cash, acctype, visit) VALUES (';
    str += "'" + item.email + "', ";
    str += "'" + item.password + "', ";
    str += "'" + item.jwt + "', ";
    str += item.userid + ", ";
    str += "'" + item.ipaddress + "', ";
    str += item.timecode + ", ";
    str += "'" + item.name + "', ";
    str += item.latitude + ", ";
    str += item.longitude + ", ";
    str += "'" + item.location + "', ";
    str = arrQueryStr(str, item.likes);    
    str += item.age + ", ";
    str += item.birthday + ", ";
    str += item.monthOfBirth + ", ";
    str += item.yearOfBirth + ", ";
    str += item.growth + ", ";
    str += item.weight + ", ";
    str += item.gender + ", ";
    str += item.genderVapor + ", ";
    str += item.photoMain + ", ";
    str = arrQueryStr(str, item.photoLink);
    str += item.signZodiac + ", ";
    str += item.education + ", ";
    str += item.fieldOfActivity + ", ";
    str += item.maritalStatus + ", ";
    str += item.children + ", ";
    str += item.religion + ", ";
    str += item.smoke + ", ";
    str += item.alcohol + ", ";
    str += "'" + item.discription + "', ";
    str += item.profit + ", ";
    str = arrQueryStr(str, item.interests);
    str += "'" + JSON.stringify(item.filters) + "', ";
    str = arrQueryInt(str, item.iLikeСharacter); 
    str = arrQueryInt(str, item.iDontLikeСharacter);
    str += item.raiting + ", ";
    str += item.cash + ", ";
    str += 'user' + ", ";
    str += "'" + JSON.stringify({}) + "', ";
   

    str = str.slice(0, -2);
    str += ');';
    return str;
});

const appUsers = document.getElementById('appUsers');

arrPersonQuery.forEach((value, i) => {
    appUsers.innerHTML += '<div><span>' + value + '</span></div>'
})

// console.log(arrPersonQuery);
