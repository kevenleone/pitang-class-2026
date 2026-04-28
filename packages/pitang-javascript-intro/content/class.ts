class Animal {
    protected nome: string;

    constructor(nome: string) {
        this.nome = nome;
    }

    public falar() {
        console.log(this.nome + ' emite um barulho.');
    }
}

class Cachorro extends Animal {
    public override falar() {
        console.log(this.nome + ' latidos.');
    }
}

const cachorro = new Cachorro('Mat');

cachorro.falar();
