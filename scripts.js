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

        console.log('1. Создайте самостоятельную функцию getInfo, которая будет возвращать в одной строке имя, фамилию и город пользователя:');
        persons.forEach(person => {
            console.log(getInfo.call(person));
        });

        console.log('2. Найдите среди пользователей всех дизайнеров, которые владеют Figma:');
        const FigmaDesigners = getFigmaDesigners();
        FigmaDesigners.forEach(designer => {
            console.log(getInfo.call(designer));
        });

        console.log('3.  Найдите первого попавшегося разработчика, который владеет React:');
        const DeveloperReact = getDeveloperReact();
        DeveloperReact.forEach(developer => {
            console.log(getInfo.call(developer));
        });

        console.log('4. Все ли пользователи старше 18 лет:');
        checkAge();

        console.log('5. backend-разработчики из Москвы, которые ищут работу на полный день в порядке возрастания зарплатных ожиданий:');
        const BackendDevelopers = getBackendDevelopersFromMoscow();
        BackendDevelopers.forEach(backend => {
            console.log(getInfo.call(backend));
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
    let allYear18 = persons.every(p => {
        let dateParts = p.personal.birthday.split('.');
        let userDate = new Date(+dateParts[2]);
        let currentYear = new Date().getFullYear();
        let age = currentYear - userDate;
        return age > 18;
    });
    console.log('Все пользователи старше 18 лет: ' + allYear18);
}

//6. Найдите всех backend-разработчиков из Москвы, которые ищут работу на полный день и отсортируйте их в порядке возрастания зарплатных ожиданий.
function getBackendDevelopersFromMoscow() {
    let backendDevelopersFromMoscow = persons.filter(p => {
        let isBackend = false;
        let hasValidSalaryReq = false;
        let hasValidEmploymentReq = false;
        let isLocatedInMoscow = false;

        let specialization = specializations.find(s => s.id === p.personal.specializationId);
        if (specialization && specialization.name.toLowerCase() === 'backend') {
            isBackend = true;
        }

        let salaryReq = p.request.find(req => req.name.toLowerCase() === 'зарплата');
        if (salaryReq && salaryReq.value >= 0) {
            hasValidSalaryReq = true;
        }
        let employmentReq = p.request.find(req => req.name.toLowerCase() === 'тип занятости');
        if (employmentReq && employmentReq.value.toLowerCase() === 'полная') {
            hasValidEmploymentReq = true;
        }

        if (p.personal.locationId === 1) {
            isLocatedInMoscow = true;
        }

        return isBackend && hasValidSalaryReq && hasValidEmploymentReq && isLocatedInMoscow;
    });

    backendDevelopersFromMoscow.sort((a, b) => {
        let aSalary = a.request.find(req => req.name.toLowerCase() === 'зарплата').value;
        let bSalary = b.request.find(req => req.name.toLowerCase() === 'зарплата').value;
        return aSalary - bSalary;
    });
}