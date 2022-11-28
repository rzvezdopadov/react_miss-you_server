const Person = {
    id: 0,
    timeframe: [],
}

const arrPerson = []; 

const personId = 2000;

for (let i=1; i<personId+1; i++) {
    const person = JSON.parse(JSON.stringify(Person));

    person.id = i;
    arrPerson.push(person);
}

const arrPersonQuery = arrPerson.map((item)=>{
    let str = `INSERT INTO public.users_statistics(id, visit) VALUES (${item.id}, ARRAY [] ::JSON []);`
    return str;
});


const appUsers = document.getElementById('appUsers');

arrPersonQuery.forEach((value) => {
    appUsers.innerHTML += '<div><span>' + value + '</span></div>'
})


