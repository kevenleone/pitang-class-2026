// ...

const user = {
    name: 'Keven',
    obj: {
        name: 'Murilo',
    },
};

const user2 = {
    ...user.obj,
    city: 'Recife',
    name: 'Keven',
};

const { name = 'Keven', ...userxxx } = user2;

const name2 = user2.name || 'Keven2';

const users = ['Keven', 'Beatriz', 'Caio'];
const users2 = [...users];

users2.push('Marcio');
users2.pop();
users2.pop();

console.log(users);
console.log(users2);

// const usersFromRecife = [...users, "Maria", "Eduardo", "Rafael"];

// // const firstUser = users[0];
// // const restUsers = users.slice(1);

// const [firstUser, ...restUsers] = users;

// console.log(firstUser);
// console.log(restUsers);
// console.log(usersFromRecife);
