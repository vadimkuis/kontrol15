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
        const figmaDesigners = getFigmaDesigners();
        figmaDesigners.forEach(designer => {
            console.log(getInfo.call(designer));
        });

        console.log('4.  Найдите первого попавшегося разработчика, который владеет React:');
        const developerReact = getDeveloperReact();
        console.log(getInfo.call(developerReact));

        console.log('5. Все ли пользователи старше 18 лет:');
        checkAge();

        console.log('6. backend-разработчики из Москвы, которые ищут работу на полный день в порядке возрастания зарплатных ожиданий:');
        const backendDevelopers = backendDevelopersFromMoscowAll();
        backendDevelopers.forEach(backend => {
            console.log(getInfo.call(backend));
        });
        console.log('7.Найдите всех дизайнеров, которые владеют Photoshop и Figma одновременно на уровне не ниже 6 баллов:');
        const designersFigmaAndPhotoshop = figmaAndPhotoshop();
        designersFigmaAndPhotoshop.forEach(designer => {
            console.log(getInfo.call(designer));
        });

        console.log('8.Команда для разработки проекта:');
        const designersFigma = createDesigner();
        designersFigma.forEach(designer => {
            console.log("Дизайнер, который лучше всех владеет Figma: " + getInfo.call(designer));
        });

        const developerAngular = createDeveloper();
        developerAngular.forEach(developer => {
            console.log("Frontend разработчик с самым высоким уровнем знания Angular:  " + getInfo.call(developer));
        });

        const backendGo = createBackendGo();
        backendGo.forEach(backend => {
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
    return persons.find(person => {
        return isFrontendDeveloper(person) && hasReactSkill(person);
    });
}

function isFrontendDeveloper(person) {
    const DeveloperSpecialization = specializations.find(s => s.name.toLowerCase() === 'frontend');
    return person.personal.specializationId === DeveloperSpecialization.id;
}

function hasReactSkill(person) {
    return person.skills.find((skill) => skill.name.toLowerCase() === 'react');
}

//5. Проверьте, все ли пользователи старше 18 лет
function checkAge() {
    const allYear18 = persons.every(p => {
        const dateParts = p.personal.birthday.split('.');
        const userDate = new Date(`${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - userDate;
        return age > 18;
    });
    console.log('Все пользователи старше 18 лет: ' + allYear18);
}

//6. Найдите всех backend-разработчиков из Москвы, которые ищут работу на полный день и отсортируйте их в порядке возрастания зарплатных ожиданий.
function backendDevelopersFromMoscowAll() {
    return persons.filter(person => {
        return isBackend(person) && employmentAll(person) && employmentAll(person);
    }).sort((a, b) => {
        let aSalary = a.request.find(req => req.name.toLowerCase() === 'зарплата').value;
        let bSalary = b.request.find(req => req.name.toLowerCase() === 'зарплата').value;
        return aSalary - bSalary;
    });
}

function isBackend(person) {
    const BackendSpecialization = specializations.find(s => s.name.toLowerCase() === 'backend');
    return person.personal.specializationId === BackendSpecialization.id && person.personal.locationId === 1;
}

function employmentAll(person) {
    return person.request.some((request) => request.name.toLowerCase() === 'тип занятости' && request.value.toLowerCase() === 'полная');
}


//7.Найдите всех дизайнеров, которые владеют Photoshop и Figma одновременно на уровне не ниже 6 баллов.
function figmaAndPhotoshop() {
    return persons.filter(person => {
        return isDesigner(person) && hasPhotoshopAndFigma(person);
    });

}

function hasPhotoshopAndFigma(person) {
    const designerPhotoshop = person.skills.some((skill) => skill.name.toLowerCase() === 'photoshop');
    const designerFigma = person.skills.some((skill) => skill.name.toLowerCase() === 'figma');
    return person.skills.some((skill) => designerPhotoshop && skill.level >= 6)
        && person.skills.some(skill => designerFigma && skill.level >= 6);
}

//8.Соберите команду для разработки проекта:
// - дизайнера, который лучше всех владеет Figma
// - frontend разработчика с самым высоким уровнем знания Angular
// - лучшего backend разработчика на Go

function createDesigner() {
    return persons.filter(person => {
        return hasFigmaBest(person);
    });
}

function hasFigmaBest(person) {
    const FigmaDesigner = person.skills.some(skill => skill.name.toLowerCase() === 'figma');
    return person.skills.some(skill => FigmaDesigner && skill.level >= 10);
}

function createDeveloper() {
    return persons.filter(person => {
        return hasAngularBest(person);
    });
}

function hasAngularBest(person) {
    const FrontendSpecialization = specializations.find(s => s.name.toLowerCase() === 'frontend');
    return person.skills.some((skill) => skill.name.toLowerCase() === 'angular' && skill.level >= 9);
}

function createBackendGo() {
    return persons.filter(person => {
        return hasGoBest(person);
    });
}

function hasGoBest(person) {
    const BackendSpecialization = specializations.find(s => s.name.toLowerCase() === 'backend');
    return person.skills.some((skill) => skill.name.toLowerCase() === 'go' && BackendSpecialization && skill.level >= 9);
}