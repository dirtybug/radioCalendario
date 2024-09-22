const user = require('./models/user');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

class UserMenu {
    constructor() {
        this.showMenu();
    }

    // Exibir o menu
    showMenu() {
        console.log("\nMenu:");
        console.log("c - Create user");
        console.log("s - Show user");
        console.log("q - Quit");
        console.log("\nDigite a letra correspondente à opção escolhida:");

        // Lê a escolha do usuário
        readline.question('> ', (key) => {
            this.handleMenuInput(key);
        });
    }

    // Comando para criar um novo usuário
    createUserCommand() {
        readline.question('Digite o email: ', (email) => {
            readline.question('Digite a senha: ', async (password) => {
                try {
                    await user.addUser(email, password); // Chama a função para adicionar um usuário
                    console.log('Usuário criado com sucesso.');
                } catch (error) {
                    console.error('Erro ao adicionar o usuário:', error);
                } finally {
                    this.showMenu(); // Mostra o menu novamente após a criação do usuário
                }
            });
        });
    }

    // Comando para exibir todos os usuários
    async showUserCommand() {
        try {
            const users = await user.showAllUsers(); // Chama a função para buscar todos os usuários
            if (users && users.length > 0) {
                users.forEach((user, index) => {
                    console.log(`${index + 1}. ${user.email}`);
                });
            } else {
                console.log('Nenhum usuário encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        } finally {
            this.showMenu(); // Mostra o menu novamente após exibir as informações dos usuários
        }
    }

    // Gerencia a entrada do usuário para o menu
    handleMenuInput(key) {
        switch (key.trim()) {
            case 'c':
                this.createUserCommand(); // Chama o comando para criar usuário
                break;
            case 's':
                this.showUserCommand(); // Chama o comando para exibir usuários
                break;
            case 'q':
                console.log("Exiting...");
                readline.close(); // Fecha a interface readline
                process.exit(0); // Encerra a aplicação
                break;
            default:
                console.log("Opção inválida, tente novamente.");
                this.showMenu();
                break;
        }
    }
}

// Instanciar e iniciar o menu de usuário
const userMenu = new UserMenu();
