const ratingTariffs = [
    {
        idRate: "dvssdfv",
        amountRate: 1,
	    price: 10,
        discount: 0,
    },
    {
        idRate: "dfbdfg",
        amountRate: 3,
	    price: 27,
        discount: 5,
    },
    {
        idRate: "wrgerg",
        amountRate: 10,
	    price: 90,
        discount: 10,
    },
    {
        idRate: "rtyjty",
        amountRate: 50,
	    price: 400,
        discount: 20,
    },
    {
        idRate: "fdbxfdg",
        amountRate: 100,
	    price: 700,
        discount: 30,
    },
    {
        idRate: "zsdfgv",
        amountRate: 200,
	    price: 1200,
        discount: 40,
    },
    {
        idRate: "ergeeg",
        amountRate: 500,
	    price: 2500,
        discount: 50,
    },
]

strTariffs = '';
ratingTariffs.forEach((value)=>{
    strTariffs += `'${JSON.stringify(value)}' :: JSON, `
});
strTariffs = strTariffs.slice(0, -2);

let str = `INSERT INTO public.shop(ratingtariffs) VALUES (ARRAY [${strTariffs}]);`

const app = document.getElementById('app');

app.innerHTML += '<div><span>' + str + '</span></div>'



