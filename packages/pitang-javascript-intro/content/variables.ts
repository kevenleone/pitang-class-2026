interface CompanyWithRegion {
    region: {
        city: string;
        country: string;
    };
}

// interface Company extends CompanyWithRegion {
//   name: string | undefined;
// }

type Company = CompanyWithRegion & {
    name: string | undefined;
};

const company: Company = {
    name: 'Pitang',
    region: {
        city: 'Recife',
        country: 'Brazil',
    },
};

company.name = 'Pitang Recife';

delete company.name;

console.log(company.name);

const active = true; // Boolean
const name = null; // Nulo
const age = undefined; // Undefined
const year = 2020; // Number
const bigint = Number.MAX_VALUE;
const name2 = 'keven';
const object = {
    active,
    age,
    bigint,
    name,
    name2,
    year,
};

delete object.active;

object.active = active;

console.log(object.active);
