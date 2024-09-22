class Login {
    constructor() {
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.loginForm = document.getElementById('loginForm');
        this.toggleLoginButton = document.getElementById('toggleLogin');
        this.logoutButton = document.getElementById('logout'); // Botão de logout
        this.logoutButton.addEventListener('click', (e) => this.logoutUser(e));
        this.loginForm.style.display = 'none;';
        

        this.loginForm.addEventListener('submit', (e) => this.loginUser(e));
            // Mostrar/ocultar o formulário de login
        this.toggleLoginButton.addEventListener('click',(e) => this.displayLoginform(e) );

        // Check auth on page load
        this.checkAuth();
    }
    showLogin(event) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm.style.display === 'none' || loginForm.style.display === '') {
            loginForm.style.display = 'block';
        } else {
            loginForm.style.display = 'none';
        }
    }
    loginUser(event) {
        event.preventDefault();
        const email = this.usernameInput.value;
        const password = this.passwordInput.value;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "api/login", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                localStorage.setItem('token', response.token);
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('eventForm').style.display = 'block';
                this.logoutButton.style.display = ''; // Ocultar o botão de logout após logout
                this.toggleLoginButton.style.display = ''; // Mostrar o botão de login novamente
                console.log('Login bem-sucedido!');
            } else if (xhr.readyState === 4) {
                alert('Credenciais inválidas');
            }
        };

        xhr.onerror = () => {
            console.error('Erro ao fazer login');
        };

        const data = JSON.stringify({ email, password });
        xhr.send(data);
    }

    checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            document.getElementById('eventForm').style.display = 'none';
            this.logoutButton.style.display = 'none'; // Ocultar o botão de logout após logout
            this.toggleLoginButton.style.display = ''; // Mostrar o botão de login novamente
        } else {
            document.getElementById('eventForm').style.display = 'block';
            this.logoutButton.style.display = 'block'; // Ocultar o botão de logout após logout
            this.toggleLoginButton.style.display = 'block';

        }
    }
    logoutUser(e) {
        const token = localStorage.getItem('token');

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "api/logout", true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`); // Passa o token no header

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                localStorage.removeItem('token'); // Remove o token do localStorage
                document.getElementById('loginForm').style.display = 'block';
                document.getElementById('eventForm').style.display = 'none';
                this.logoutButton.style.display = 'none'; // Ocultar o botão de logout após logout
                this.toggleLoginButton.style.display = 'block'; // Mostrar o botão de login novamente
                console.log('Logout realizado com sucesso!');
            } else if (xhr.readyState === 4) {
                console.error('Erro ao fazer logout');
            }
        };

        xhr.onerror = () => {
            console.error('Erro ao fazer logout');
        };

        xhr.send(); // Envia a requisição de logout
    }
    displayLoginform(e)
    {
        if (this.loginForm.style.display === 'none' || this.loginForm.style.display === '') {
            this.loginForm.style.display = 'block';
            this.toggleLoginButton.textContent = 'Esconder Login';
        } else {
            this.loginForm.style.display = 'none';
            this.toggleLoginButton.textContent = 'Mostrar Login';
        }
    }


}
