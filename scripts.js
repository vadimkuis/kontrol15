///1. Импортируйте данные из файлов в массивы аналогично тому, как было в уроке.
let persons = [];
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
        persons = response[0];
        cities = response[1];
        specializations = response[2];

        console.log('2. Создайте самостоятельную функцию getInfo, которая будет возвращать в одной строке имя, фамилию и город пользователя:');
        persons.forEach(person => {
            console.log(getInfo.call(person));
        });

        console.log('3. Найдите среди пользователей всех дизайнеров, которые владеют Figma:');
        const FigmaDesigners = getFigmaDesigners();
        FigmaDesigners.forEach(designer => {
            console.log(getInfo.call(designer));
        });

        console.log('4.  Найдите первого попавшегося разработчика, который владеет React:');
        const DeveloperReact = getDeveloperReact();
        DeveloperReact.forEach(developer => {
            console.log(getInfo.call(developer));
        });

        console.log('5. Все ли пользователи старше 18 лет:');
        checkAge();

        console.log('6. backend-разработчики из Москвы, которые ищут работу на полный день в порядке возрастания зарплатных ожиданий:');
        const BackendDevelopers = BackendDevelopersFromMoscowAll();
        BackendDevelopers.forEach(backend => {
            console.log(getInfo.call(backend));
        });
        console.log('7.Найдите всех дизайнеров, которые владеют Photoshop и Figma одновременно на уровне не ниже 6 баллов:');
        const DesignersFigmaAndPhotoshop = figmaAndPhotoshop();
        DesignersFigmaAndPhotoshop.forEach(designer => {
            console.log(getInfo.call(designer));
        });

        console.log('8.Команда для разработки проекта:');
        const DesignersFigma = createDesigner();
        DesignersFigma.forEach(designer => {
            console.log("Дизайнер, который лучше всех владеет Figma: " + getInfo.call(designer));
        });

        const DeveloperAngular = createDeveloper();
        DeveloperAngular.forEach(developer => {
            console.log("Frontend разработчик с самым высоким уровнем знания Angular:  " + getInfo.call(developer));
        });

        const BackendGo = createBackendGo();
        BackendGo.forEach(backend => {
            console.log("Лучший backend разработчика на Go:  " + getInfo.call(backend));
        });
    });

//2. Создайте самостоятельную функцию getInfo, которая будет возвращать в одной строк е имя, фамилию и город пользователя, используя this. Эта функция будет использоваться для вывода полного имени в вашем коде, вызывать ее нужно будет с помощью метода call.
function getInfo() {
    const {firstName, lastName} = this.personal;
    let city = cities.find((city) => city.id === this.personal.locationId);
    return `${firstName} ${lastName}, ${city.name || "Не удалось найти город!"}`;
}

//3. Найдите среди пользователей всех дизайнеров, которые владеют Figma и выведите данные о них в консоль с помощью getInfo.
function getFigmaDesigners() {
    return persons.filter(person => {
        return isDesigner(person) && hasFigmaSkill(person);
    });
    console.log('Не удалось найти дизайнера, который владеет Figma');
}

function isDesigner(person) {
    const DesignerSpecialization = specializations.find(s => s.name.toLowerCase() === 'designer');
    return person.personal.specializationId === DesignerSpecialization.id;
}

function hasFigmaSkill(person) {
    return person.skills.some((skill) => skill.name.toLowerCase() === 'figma');
}

//4. Найдите первого попавшегося разработчика, который владеет React. Выведите в консоль через getInfo данные о нем.
function getDeveloperReact() {
    return persons.filter(person => {
        return isDeveloper(person) && hasReactSkill(person);
    });
    console.log('Не удалось найти разработчика, который владеет React');
}

function isDeveloper(person) {
    const DeveloperSpecialization = specializations.find(s => s.name.toLowerCase() === 'frontend');
    return person.personal.specializationId === DeveloperSpecialization.id;
}

function hasReactSkill(person) {
    return person.skills.some((skill) => skill.name.toLowerCase() === 'react');
}

//5. Проверьте, все ли пользователи старше 18 лет
function checkAge() {
    const allYear18 = persons.every(p => {
        const dateParts = p.personal.birthday.split('.');
        const userDate = new Date(`${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - userDate;
        return age > 18;
        console.log(age);
    });
    console.log('Все пользователи старше 18 лет: ' + allYear18);
}

//6. Найдите всех backend-разработчиков из Москвы, которые ищут работу на полный день и отсортируйте их в порядке возрастания зарплатных ожиданий.
function BackendDevelopersFromMoscowAll() {
    return persons.filter(person => {
        return isBackend(person) && employmentAll(person);
    });
    console.log('backend-разработчиков из Москвы, которые ищут работу на полный день и отсортируйте их в порядке возрастания зарплатных ожиданий');

}

function isBackend(person) {
    const BackendSpecialization = specializations.find(s => s.name.toLowerCase() === 'backend');
    return person.personal.specializationId === BackendSpecialization.id && person.personal.locationId === 1;
}

function employmentAll(person) {
    return person.request.some((request) => request.value.toLowerCase() === 'полная');
}


//7.Найдите всех дизайнеров, которые владеют Photoshop и Figma одновременно на уровне не ниже 6 баллов.
function figmaAndPhotoshop() {
    return persons.filter(person => {
        return isDesigner(person) && hasPhotoshopandFigma(person);
    });
    console.log('Не удалось найти  дизайнеров, которые владеют Photoshop и Figma одновременно на уровне не ниже 6 баллов');

}

function hasPhotoshopandFigma(person) {
    return person.skills.some((skill) => skill.name.toLowerCase() === 'photoshop' && skill.level >= 6)
        && person.skills.some(skill => skill.name.toLowerCase() === 'figma' && skill.level >= 6);
}

//8.Соберите команду для разработки проекта:
// - дизайнера, который лучше всех владеет Figma
// - frontend разработчика с самым высоким уровнем знания Angular
// - лучшего backend разработчика на Go

function createDesigner() {
    return persons.filter(person => {
        return hasFigmaBest(person);
    });
    console.log('Не удалось найти лучшего дизайнера');
}

function hasFigmaBest(person) {
    return person.skills.some(skill => skill.name.toLowerCase() === 'figma' && skill.level >= 10);
}
function createDeveloper() {
    return persons.filter(person => {
        return hasAngularBest(person);
    });
    console.log('Не удалось найти лучшего разработчика');
}
function hasAngularBest(person) {
    return person.skills.some((skill) => skill.name.toLowerCase() === 'angular' && skill.level >= 9);
}
function createBackendGo() {
    return persons.filter(person => {
        return hasGoBest(person);
    });
    console.log('Не удалось найти лучшего бэкенд разработчика');
}
function hasGoBest(person) {
    return person.skills.some((skill) => skill.name.toLowerCase() === 'go' && skill.level >= 9);
}