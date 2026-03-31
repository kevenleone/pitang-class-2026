interface CompanyWithRegion {
  region: {
    city: string;
    country: string;
  };
}

// interface Company extends CompanyWithRegion {
//   name: string | undefined;
// }

type Company = {
  name: string | undefined;
} & CompanyWithRegion;

const company: Company = {
  name: "Pitang",
  region: {
    country: "Brazil",
    city: "Recife",
  },
};

company.name = "Pitang Recife";

delete company.name;

console.log(company.name);

const active = true; // Boolean
const name = null; // Nulo
const age = undefined; // Undefined
const year = 2020; // Number
const bigint = Number.MAX_VALUE;
const name2 = "keven";
const object = {
  active,
  name,
  age,
  year,
  bigint,
  name2,
};

delete object.active;

object.active = active;

console.log(object.active);
