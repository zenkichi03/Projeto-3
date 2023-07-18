// comandos que servem para "importar" os frameworks 'express' e 'cors', da pasta 'node_modules'
const express = require('express');
const cors = require('cors');

// importação do Sequelize para realizar alterações juntamente com consultas
const { Sequelize } = require('./models');

const models = require('./models');
const { json } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let pedido = models.Pedido;
let servico = models.Servico;
let itempedido = models.ItemPedido;
let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemCompra;

//'Olá, mundo'.
app.get('/', function(req, res){
    res.send('Olá, mundo!')
});

//inserção de clientes
app.post('/clientes', async(req, res)=>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Cliente criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar"
        })
    });    
});

//inserção de pedidos
app.post('/pedidos', async(req, res)=>{
    await pedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Pedido criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar"
        })
    });
});

//inserção de serviços
app.post('/servicos',  async(req, res)=>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

//inserção de itemPedido
app.post('/itempedidos', async(req, res)=>{
    await itempedido.create(
        req.body    
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso."
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

//inserção de compras
app.post('/compras', async(req, res)=>{
    await compra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Compra cadastrada com sucesso."
        });
    }).catch(()=>{
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar"
        });
    });
});

//inserção de produtos
app.post('/produtos', async(req, res)=>{
    await produto.create(
        req.body
    )
    .then((item)=>{
        return res.json({
            error: false,
            message: 'Produto cadastrado com sucesso.',
            item
        });
    }).catch(()=>{
        return res.status(400).json({
            error: true,
            message: 'Erro de conexão.'
        });
    });
});

//inserção de itemcompra
app.post('/itemcompra', async(req, res)=>{
    await itemcompra.create(
        req.body
    )
    .then((item)=>{
        return res.json({
            error: false,
            item
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: true,
            message: 'Erro de conexão'
        });
    });
});

//consulta de serviços em ordem alfabética ascendente
app.get('/listaservicos', async(req, res)=>{
    await servico.findAll({
        // raw: true
        order: [['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

//consulta da quantidade de servicos
app.get('/ofertaservicos', async(req, res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos})
    })
})

//consulta servico com base na sua id 
app.get('/servico/:id', async(req, res)=>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: Não foi possível conectar."
        });
    });
});


/* consulta de serviço por meio do seu id, e retorno dos itempedidos associados a ele.
Com isso, é possível saber qual pedido está associado a qual serviço.
*/
app.get('/servico/:id/pedidos', async(req, res)=>{
    await itempedido.findAll({
        where: {ServicoId: req.params.id}})
    .then(item=>{
        return res.json({
            error: false,
            item
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: Não foi possível conectar"
        });
    });    
});

app.get('/produtos/:id/compras', async(req, res)=>{
    await itemcompra.findAll({
        where: {ProdutoId: req.params.id}
    })
    .then((item)=>{
        return res.json({
            error: false,
            item
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: true,
            message: 'Erro de conexão'
        });
    });
});

//consulta das compra do cliente com base em seu id
app.get('/clientes/:id/compras', async(req, res)=>{
    await compra.findAll({
        where: {ClienteId: req.params.id}
    })
    .then((item)=>{
        return res.json({
            error: false,
            item
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: true,
            message: 'Erro de conexão'
        });
    });
});

//consulta dos pedidos com base no id de um cliente
app.get('/cliente/:id/pedidos', async(req, res)=>{
    await pedido.findAll({
        where: {ClienteId: req.params.id}})
    .then(item =>{
        return res.json({
            error: false,
            item
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: Não foi possível se conectar"   
        });
    });        
});

// app.get('/itempedido/:ServicoId/servicos', async(req, res)=>{
//     await servico.findAll({
//         where: {id: req.params.id}})
//     .then(function(item){
//         return res.json({
//             error: false,
//             item
//         });        
//     }).catch((erro)=>{
//         return res.status(400).json({
//             error: true,
//             message: "Erro."
//         });
//     });
// });

//consulta dos serviços com base no id de um pedido
app.get('/pedidos/:id/servicos', async(req, res)=>{
    await itempedido.findAll({
        where: {PedidoId: req.params.id}})
    .then(function(item){
        return res.json({
            error: false,
            item
        });
    }).catch((erro)=>{
        return res.status(400).json({
            error: true,
            message: 'Erro: Não foi possível se conectar.'
        });
    });
});

//consulta dos produtos com base no id da compra
app.get('/compras/:id/produtos', async(req, res)=>{
    await itemcompra.findAll({
        where: {CompraId: req.params.id}
    })
    .then((item)=>{
        return res.json({
            error: 'false',
            item
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: 'true',
            message: 'Erro de conexão.'
        });
    });
});

// consulta de todos os clientes
app.get('/listaclientes', async(req, res)=>{
    await cliente.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});

//consulta de todos os pedidos
app.get('/listapedidos', async(req, res)=>{
    await pedido.findAll({
        raw: true
    }).then(function(pedidos){
        res.json({pedidos})
    });
});

//consulta das compras
app.get('/listacompras', async(req, res)=>{
    await compra.findAll({
        raw: true
    }).then(function(compras){
        return res.json({compras})
    });
});


//consulta dos produtos
app.get('/listaprodutos', async(req, res)=>{
    await produto.findAll({
        raw: true
    })
    .then((item)=>{
        return res.json({
            error: false,
            item
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: true,
            message: 'Erro de conexão'
        });
    });
});

//consulta de todos os itemcompra
app.get('/listaitemcompra', async(req, res)=>{
    await itemcompra.findAll({
        raw: true
    })
    .then((item)=>{
        return res.json({
            error: false,
            item
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: true,
            message: 'Erro de conexão'
        });
    });
});

//consulta dos pedidos com base no id
app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id)
    .then((peds)=>{
        return res.json({
            error: false,
            peds
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: true,
            message: "Erro de conexão com a API"
        });
    });
});

// consulta de todos os clientes, ordenando-os com base nas suas antiguidades como clientes
app.get('/ordemclientes', async(req, res)=>{
    await cliente.findAll({
        order: [['clienteDesde', 'DESC']]
    }).then(function(clientes){
        res.json({clientes})
    });
});

// consulta de todos os itens de pedidos, a partir do maior valor, indo até o menor
app.get('/listaitempedidos', async(req, res)=>{
    await itempedido.findAll({
        order: [['valor', 'DESC']]
    }).then(function(itempedido){
        res.json({itempedido})
    });
});

// query que faz a contagem de quantos clientes estão na base de dados
app.get('/quantidadeclientes', async(req, res)=>{
    await cliente.count('id').then(function(clientes){
        res.json({clientes})
    });
});

// consulta de quantos pedidos foram solicitados
app.get('/ofertapedidos', async(req, res)=>{
    await pedido.count('id').then(function(pedidos){
        res.json({pedidos})
    });
});

// método de alteração manual da tabela servico
// app.get('/atualizaservico', async(req, res)=>{
//     await servico.findByPk(1)
//     .then(serv =>{
//         serv.nome = 'HTML/CSS/JS';
//         serv.descricao = 'Desenvolvimento de páginas estáticas e dinâmicas estilizadas';
//         serv.save();
//         return res.json({serv})
//     });
// });

//alteração da tabela servico por meio de requisições externas
app.put('/atualizacaoservico', async(req, res)=>{
    await servico.update(req.body, {
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço alterado com sucesso."
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço"
        });
    });
});

//atualização de um serviço específico com base em seu id
app.put('/atualizaservico/:id', async(req, res)=>{
    await servico.update(req.body, {
        where: {id: req.params.id}
    })
    .then(function(){
        return res.json({
            error: 'false',
            message: 'Serviço alterado com sucesso'
        });
    })
    .catch(function(erro){
        return res.status(400).json({
            error: 'true',
            message: 'Erro'
        });
    });
});

//atualização de um cliente específico com base em seu id
app.put('/atualizacliente/:id', async(req, res)=>{
    await cliente.update(req.body, {
        where: {id: req.params.id}
    })
    .then(function(){
        return res.json({
            error: 'false',
            message: 'Cliente alterado com sucesso'           
        });
    })
    .catch(function(erro){
        return res.status(400).json({
            error: 'true',
            message: 'Erro: Não foi possível se conectar com o servidor'
        });
    });
});

//atualização de um pedido específico com base em seu id
app.put('/atualizapedido/:id', async(req, res)=>{
    await pedido.update(req.body, {
        where: {id: req.params.id}
    })
    .then(function(){
        return res.json({
            error: false,
            message: 'Pedido alterado com sucesso'
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: true,
            message: 'Erro'
        });
    });
});

//atualização da compra com base no id
app.put('/atualizacompra/:id', async(req, res)=>{
    await compra.update(req.body, {
        where: {id: req.params.id}
    })
    .then(()=>{
        return res.json({
            error: 'false',
            message: 'Compra editada com sucesso'
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: 'true',
            message: 'Erro de conexão'
        });
    });
});

//atualiza produto por id
app.put('/atualizaproduto/:id', async(req, res)=>{
    await produto.update(req.body, {
        where: {id: req.params.id}
    })
    .then(()=>{
        return res.json({
            error: false,
            message: 'Produto editado com sucesso.'
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: true,
            message: 'Erro de conexão.'
        });
    });
});

//consultando o pedido, e todos as classes que se relacionam com o mesmo
app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id,{include: [{all: true}]})
    .then(ped =>{
        return res.json({ped});
    })
})

//alterando um elemento com base na consulta que informa os atores que se relacionam com o pedido. 
app.put('/pedidos/:id/editaritem', async(req, res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: "Pedido não foi encontrado."
        });
    };

    if(!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            message: "Serviço não foi encontrado."
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "Pedido foi alterado com sucesso",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível alterar."
        });
    });
});

//consulta da tabela clientes, e todas as entidades que a relacionam
app.get('/clientes/:id', async(req, res)=>{
    await cliente.findByPk(req.params.id,{include: [{all: true}]})
    .then(clie =>{
        return res.json({clie});
    })
})

//exclusão "interna" de cliente
// app.get('/excluircliente', async(req, res)=>{
//     await cliente.destroy({
//         where: {id: 8}
//     });
// });

//exclusão do cliente por requisição externa
app.delete('/excluicliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente excluído com sucesso."
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: Não foi possível excluir o cliente."
        });
    });
});


//excluir um pedido com base em seu id
app.delete('/excluirpedido/:id', async(req, res)=>{
    await pedido.destroy({
        where: {id: req.params.id}
    })
    .then(function(){
        return res.json({
            error: false,
            message: "Pedido excluído com sucesso."
        });
    })
    .catch((erro)=>{
        return res.status(400).json({
            error: true,
            message: "Erro: Não foi possível excluir o cliente."
        });
    });
});

//exclusão de um serviço com base em seu id
app.delete('/excluirservico/:id', async(req, res)=>{
    await servico.destroy({
        where: {id: req.params.id}
    })
    .then(function(){
        return res.json({
            error: 'false',
            message: 'Serviço excluído com sucesso'
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: 'true',
            message: "Erro: Não foi possível excluir o cliente."
        });
    });
});

//exclusão de uma compra com base em seu id
app.delete('/excluircompra/:id', async(req, res)=>{
    await compra.destroy({
        where: {id: req.params.id}
    })
    .then(function(){
        return res.json({
            error: false,
            message: 'Compra excluída com sucesso'
        });
    })
    .catch(()=>{
        return res.status(400).json({
            error: true,
            message: 'Erro: Não foi possível excluir o cliente'
        });
    });
});

app.delete('/excluirproduto/:id', async(req, res)=>{
    await produto.destroy({
        where: {id: req.params.id}
    }).then(()=>{
        return res.json({
            error: false,
            message: 'Produto excluído com sucesso.'
        });
    }).catch(()=>{
        return res.status(400).json({
            error: true,
            message: 'Erro: Não foi possível excluir o cliente.'
        });
    });
});

let port = process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo: http://localhost:3001');
})