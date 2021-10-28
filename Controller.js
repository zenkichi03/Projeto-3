const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models=require('./models');

const app=express();
app.use(cors());
app.use(express.json());

let cliente=models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let itemcompra = models.ItemCompra;
let produto = models.Produto;

app.get('/', function(rec, res){
    res.send('Olá, mundo')
});

app.post('/servicos', async(req, res)=>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar!"
        })
    });
});

app.post('/clientes', async(req, res)=>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
           error: false,
           message: "Cliente adicionado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível implementar o cliente à base de dados!"
        })
    });
});

app.post('/pedidos', async(req, res)=>{
    await pedido.create(
        req.body
    ).then(function(){
        return res.json({
           error: false,
           message: "Pedido criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível criar o pedido!"
        })
    });
});

app.post('/itenspedido', async(req, res)=>{
    await itempedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Item criado com sucesso"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível criar o item!"
        })
    });
});

app.post('/compras', async(req, res)=>{
    await compra.create(
        req.body
    ).then(function(){
        return res.json({
           error: false,
           message: "Compra feita com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível fazer a compra!"
        })
    });
});

app.post('/produtos', async(req, res)=>{
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
           error: false,
           message: "Produto comprado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível comprar o produto!"
        })
    });
});

app.post('/itenscompra', async(req, res)=>{
    await itemcompra.create(
        req.body
    ).then(function(){
        return res.json({
           error: false,
           message: "Item criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Não foi possível criar o item!"
        })
    });
});


app.get('/listaservicos', async(req, res)=>{
    await servico.findAll({
        // raw: true
        order: [['nome' , 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

app.get('/ofertaservicos', async(req, res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos})
    });
});

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
            message: "Erro: Não foi possível conectar"
        });
    });
});

app.get('/listaclientes', async(req, res)=>{
    await cliente.findAll({
        // raw: true
        order: [['nome' , 'ASC']]
    }).then(function(clientes){
        res.json({clientes})
    });
});

// app.put('/atualizaservico', async(req, res)=>{
//     await servico.update(req.body,{
//         where: {id: req.body.id}
//     }).then(function(){
//         return res.json({
//             error: false,
//             message: "O serviço foi alterado com sucesso"
//         });
//     }).catch(function(erro){
//         return res.status(400).json({
//             error: true,
//             message: "Houve erro na tentativa de alteração do serviço"
//         });
//     });
// });

app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id, {include: [{all: true}]})
    .then(ped=>{
        return res.json({ped});
    })
})

app.put('/pedidos/:id/editaritem', async(req, res)=>{
    const item={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido não foi encontrado.'
        });
    };
    if (!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            message: 'Servico não foi encontrado'
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
            message: "Erro: Não foi possível alterar!"
        }); 
    });
});


app.get('/compras/:id', async(req, res)=>{
    await compra.findByPk(req.params.id, {include: [{all: true}]})
    .then(ped=>{
        return res.json({ped});
    })
})

app.put('/compras/:id/itemedit', async(req, res)=>{
    const itemm={
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await compra.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Compra não foi encontrada.'
        });
    };
    if (!await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            error: true,
            message: 'Produto não foi encontrado'
        });
    };
    await itemcompra.update(itemm, {
        where: Sequelize.and({ProdutoId: req.body.ProdutoId},
            {CompraId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: "Compra foi alterada com sucesso",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: Não foi possível alterar!"
        }); 
    });
});




app.get('/excluircliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente foi excluído com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o cliente"
        });
    });
});

app.get('/excluirpedido/:id', async(req, res)=>{
    await pedido.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Pedido foi excluído com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o pedido"
        });
    });
});

app.get('/excluiritempedido/:id', async(req, res)=>{
    await itempedido.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Item foi excluído com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o item"
        });
    });
});

app.get('/excluircompra/:id', async(req, res)=>{
    await compra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Compra excluída com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir a compra"
        });
    });
});

app.get('/excluiritemcompra/:id', async(req, res)=>{
    await itemcompra.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Item foi excluído da compra com sucesso"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir o item da compra"
        });
    });
});

let port=process.env.PORT || 3001;

app.listen(port,(req, res)=>{
    console.log('Servidor ativo: http://localhost:3001');
})
