///1. Импортируйте данные из файлов в массивы аналогично тому, как было в уроке.
let person = [];
let cities = [];
let specializations = [];

Promise.all(
    [
        fetch('person.json'),
        fetch('cities.json'),
        fetch('specializations.json')
    ]
).then(async ([personResponse, citiesResponse, specializationsResponse]) => {
    const personJson = await personResponse.json();
    const citiesJson = await citiesResponse.json();
    const specializationsJson = await specializationsResponse.json();
    return [personJson, citiesJson, specializationsJson]
})
    .then(response => {
        person = response[0];
        cities = response[1];
        specializations = response[2];

        getInfo.call(person[0]);
        getInfoFigma();
        getReactDeveloper();
        checkAge();

    });

//2. Создайте самостоятельную функцию getInfo, которая будет возвращать в одной строке имя, фамилию и город пользователя, используя this. Эта функция будет использоваться для вывода полного имени в вашем коде, вызывать ее нужно будет с помощью метода call.
function getInfo() {
    const {firstName, lastName} = this.personal;
    let city = cities.find((city) => city.id === this.personal.locationId);

    if (city && city.name) {
        let location = city.name;
        console.log(firstName + ' ' + lastName + ', ' + location);
    } else {
        console.log('Не удалось найти город!');
    }
}
//3. Найдите среди пользователей всех дизайнеров, которые владеют Figma и выведите данные о них в консоль с помощью getInfo.
function getInfoFigma() {
    let designers = specializations.find(s => s.name.toLowerCase() === 'designer');
    if (designers) {
        let designersFigma = person.filter(p => {
            return p.personal.specializationId === designers.id;
        });
        designersFigma.forEach(designer => {
            getInfo.call(designer);
        });
    } else {
        console.log('Не удалось найти дизайнера, который владеет Figma');
    }
}
//4. Найдите первого попавшегося разработчика, который владеет React. Выведите в консоль через getInfo данные о нем.
function getReactDeveloper() {
    let developer = person.find(p => p.skills.some(skill => skill.name.toLowerCase() === 'react'));
    if (developer) {
        getInfo.call(developer);
    } else {
        console.log('Не удалось найти разработчика, который владеет React');
    }
}
//5. Проверьте, все ли пользователи старше 18 лет
function checkAge() {
    let allYear18 = person.every(p => {
        let birthYear = new Date(p.personal.birthday).getFullYear();
        let currentYear = new Date().getFullYear();
        let age = currentYear - birthYear;
        return age > 18;
    });
    console.log('Все пользователи старше 18 лет: ' + allYear18);
}
