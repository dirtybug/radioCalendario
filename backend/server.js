const express = require('express');
const cors = require('cors');
const path = require('path'); // Importar o módulo 'path'
const { sequelize } = require('./models');
const eventRoutes = require('./routes');
const commands=require('./commands');



const app = express();
app.use(cors());
app.use(express.json());

// Rotas para eventos
app.use('/api', eventRoutes);



// Servir arquivos estáticos do frontend localizado em '../frontend'
const frontendDir = path.join(__dirname, '..', 'frontend'); // Ajusta o caminho para o diretório do frontend
app.use(express.static(frontendDir));


const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    try {
        //await sequelize.authenticate();
       // await sequelize.sync({ force: true });
        
    } catch (error) {
        console.error('Erro ao conectar db:', error);
    }
});

