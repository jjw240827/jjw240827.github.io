let testData = require('./producttest.json');

let min_price;
let max_price;
for(let tem of testData) {
    min_price ??= tem.price;
    max_price ??= tem.price;

    tem.stock ??= "알수없음";
    if(tem.price < min_price) {
        console.log("가장 작은 값 변경, 해당 상품의 정보 :", tem);
        min_price = tem.price;
    }

    if(max_price < tem.price) {
        console.log("가장 작은 값 변경, 해당 상품의 정보 :", tem);
        max_price = tem.price;
    }
}
console.log("최종 : 가장 큰 값은", max_price, "최소:", min_price);