interface Company {
    city: string;
    name: string;
}

const map = new Map<string, Company>();

const set = new Set();

const company: Company = {
    name: 'Pitang',
    city: 'Recife',
};

const companies: Company[] = [
    {
        name: 'Pitang',
        city: 'Recife',
    },
    {
        name: 'Liferay',
        city: 'Recife',
    },
];

const users = ['Keven', 'Beatriz', 'Caio'];

// for (let i = 0; i < users.length; i++) {
//   console.log(users[i]);
// }

console.log('For of');

for (const user of users) {
    console.log(user);
}

console.log('For in');

for (const key in company) {
    console.log(key, company[key]);
}

console.log('For each');

companies.forEach(function (company, index) {
    map.set(company.name, company);

    console.log(company, index);
});

console.log('Companies name');

const companiesName = companies.map(function (company) {
    return company.name;
});

const companiesNameWithArrow = companies.map((company) => company.name);

console.log(companiesName);

console.log('Companies Map');

console.log(map.get('Pitang'));
