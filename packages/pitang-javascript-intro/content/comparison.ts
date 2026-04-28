// truthy
// falsy

const food: string = 'pizza';

switch (food) {
    case 'pizza': {
        console.log('Muita pizza!!!');

        break;
    }

    case 'lasagna': {
        break;
    }

    default: {
        console.log('Outra comida...');
    }
}
