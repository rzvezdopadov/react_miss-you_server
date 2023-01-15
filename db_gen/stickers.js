const stickers = [
    {
        idstickerpack: "1",
        name: "Собачка",
	    discription: "Это стикерпак с собачкой =)",
        price: 0,
        author: "https://vk.com",
        stickers: [
            {position: 1, associate: "", link: "1.png"},
            {position: 2, associate: "", link: "2.png"},
            {position: 3, associate: "", link: "3.png"},
            {position: 4, associate: "", link: "4.png"},
            {position: 5, associate: "", link: "5.png"},
            {position: 6, associate: "", link: "6.png"},
            {position: 7, associate: "", link: "7.png"},
            {position: 8, associate: "", link: "8.png"},
            {position: 9, associate: "", link: "9.png"},
            {position: 10, associate: "", link: "10.png"},
            {position: 11, associate: "", link: "11.png"},
            {position: 12, associate: "", link: "12.png"},
            {position: 13, associate: "", link: "13.png"},
            {position: 14, associate: "", link: "14.png"},
            {position: 15, associate: "", link: "15.png"},
            {position: 16, associate: "", link: "16.png"},
            {position: 17, associate: "", link: "17.png"},
            {position: 18, associate: "", link: "18.png"},
            {position: 19, associate: "", link: "19.png"},
            {position: 20, associate: "", link: "20.png"},
            {position: 21, associate: "", link: "21.png"},
            {position: 22, associate: "", link: "22.png"},
            {position: 23, associate: "", link: "23.png"},
            {position: 24, associate: "", link: "24.png"},
            {position: 25, associate: "", link: "25.png"},
            {position: 26, associate: "", link: "26.png"},
            {position: 27, associate: "", link: "27.png"},
            {position: 28, associate: "", link: "28.png"},
            {position: 29, associate: "", link: "29.png"},
            {position: 30, associate: "", link: "30.png"},
            {position: 31, associate: "", link: "31.png"},
            {position: 32, associate: "", link: "32.png"},
            {position: 33, associate: "", link: "33.png"},
            {position: 34, associate: "", link: "34.png"},
            {position: 35, associate: "", link: "35.png"},
            {position: 36, associate: "", link: "36.png"},
            {position: 37, associate: "", link: "37.png"},
            {position: 38, associate: "", link: "38.png"},
            {position: 39, associate: "", link: "39.png"},
            {position: 40, associate: "", link: "40.png"},
            {position: 41, associate: "", link: "41.png"},
            {position: 42, associate: "", link: "42.png"},
            {position: 43, associate: "", link: "43.png"},
            {position: 44, associate: "", link: "44.png"},
            {position: 45, associate: "", link: "45.png"},
            {position: 46, associate: "", link: "46.png"},
            {position: 47, associate: "", link: "47.png"},
            {position: 48, associate: "", link: "48.png"},
            {position: 49, associate: "", link: "49.png"},
        ]
    },
    {
        idstickerpack: "2",
        name: "Динозаврик Дино",
	    discription: "Это стикерпак с динозавриком =)",
        price: 100,
        author: "https://t.me",
        stickers: [
            {position: 1, associate: "", link: "1.webp"},
            {position: 2, associate: "", link: "2.webp"},
            {position: 3, associate: "", link: "3.webp"},
            {position: 4, associate: "", link: "4.webp"},
            {position: 5, associate: "", link: "5.webp"},
            {position: 6, associate: "", link: "6.webp"},
            {position: 7, associate: "", link: "7.webp"},
            {position: 8, associate: "", link: "8.webp"},
            {position: 9, associate: "", link: "9.webp"},
            {position: 10, associate: "", link: "10.webp"},
            {position: 11, associate: "", link: "11.webp"},
            {position: 12, associate: "", link: "12.webp"},
            {position: 13, associate: "", link: "13.webp"},
            {position: 14, associate: "", link: "14.webp"},
            {position: 15, associate: "", link: "15.webp"},
            {position: 16, associate: "", link: "16.webp"},
            {position: 17, associate: "", link: "17.webp"},
            {position: 18, associate: "", link: "18.webp"},
            {position: 19, associate: "", link: "19.webp"},
            {position: 20, associate: "", link: "20.webp"},
        ]
    },
]

const arrStickersQuery = stickers.map((item)=>{
    strStickers = '';
    item.stickers.forEach((value)=>{
        strStickers += `'${JSON.stringify(value)}' :: JSON, `
    });
    strStickers = strStickers.slice(0, -2);
    
    let str = `INSERT INTO public.stickers(idstickerpack, name, discription, price, author, stickers) VALUES (
        '${item.idstickerpack}', '${item.name}', '${item.discription}', ${item.price}, '${item.author}', 
        (ARRAY [${strStickers}]));`
    return str;
});


const app = document.getElementById('app');

arrStickersQuery.forEach((value) => {
    app.innerHTML += '<div><span>' + value + '</span></div>'
})


