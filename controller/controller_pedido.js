/***************************************************************************************************************************************************
* Objetivo: Responsavel pela regra de negocio referente ao CRUD do pedido
* (GET, POST, PUT, DELETE)
* Data: 07/09/2023
* Autor: Caroline Portela
* Versão: 1.0
***************************************************************************************************************************************************/

//Import do arquivo de configuração das variaveis, constantes e funções globais
var message = require('./modulo/config.js')

var pedidoDAO = require('../model/DAO/pedidoDAO.js')

const { request } = require('express')

const inserirPedido = async function (dadosPedido) {

    if (dadosPedido.numero_pedido == '' || dadosPedido.numero_pedido == undefined || dadosPedido.numero_pedido.length > 45 ||
        dadosPedido.horario == '' || dadosPedido.horario == undefined ||
        dadosPedido.data_pedido == '' || dadosPedido.data_pedido == undefined ||
        dadosPedido.previsao_entrega == '' || dadosPedido.previsao_entrega == undefined ||
        dadosPedido.valor_total == '' || dadosPedido.valor_total == undefined ||
        dadosPedido.id_status_pedido == '' || dadosPedido.id_status_pedido == undefined ||
        dadosPedido.id_forma_pagamento == '' || dadosPedido.id_forma_pagamento == undefined ||
        dadosPedido.id_frete_area_entrega == '' || dadosPedido.id_frete_area_entrega == undefined

    ) {
        return message.ERROR_REQUIRED_FIELDS
    } else {
        //Envia os dados para a model inserir no banco de dados
        let resultDados = await pedidoDAO.insertPedido(dadosPedido)

        //Valida se o banco de dados inseriu corretamente os dados
        if (resultDados) {

            let novoPedido = await pedidoDAO.selectLastId()

            let dadosJSON = {}
            dadosJSON.status = message.SUCESS_CREATED_ITEM.status
            dadosJSON.pedidos = novoPedido

            return dadosJSON
        }
        else {
            return message.ERROR_INTERNAL_SERVER
        }

    }

}

const atualizarPedido = async function (dadosPedido, idPedido) {

    if (dadosPedido.numero_pedido == '' || dadosPedido.numero_pedido == undefined || dadosPedido.numero_pedido.length > 45 ||
        dadosPedido.horario == '' || dadosPedido.horario == undefined ||
        dadosPedido.data_pedido == '' || dadosPedido.data_pedido == undefined ||
        dadosPedido.previsao_entrega == '' || dadosPedido.previsao_entrega == undefined ||
        dadosPedido.valor_total == '' || dadosPedido.valor_total == undefined ||
        dadosPedido.id_status_pedido == '' || dadosPedido.id_status_pedido == undefined ||
        dadosPedido.id_forma_pagamento == '' || dadosPedido.id_forma_pagamento == undefined ||
        dadosPedido.id_frete_area_entrega == '' || dadosPedido.id_frete_area_entrega == undefined

    ) {
        return message.ERROR_INTERNAL_SERVER.ERROR_REQUIRED_FIELDS

    } else if (idPedido == '' || idPedido == undefined || idPedido == isNaN(idPedido)) {

        return message.message.ERROR_INVALID_ID
    } else {
        dadosPedido.id = idPedido;

        let statusId = await pedidoDAO.selectLastId();

        if (statusId) {
            //Encaminha os dados para a model 
            let resultDados = await pedidoDAO.updatePedido(dadosPedido);

            if (resultDados) {

                let dadosJSON = {}
                dadosJSON.status = message.SUCESS_UPDATED_ITEM.status
                dadosJSON.message = message.SUCESS_UPDATED_ITEM.message
                dadosJSON.pedido = dadosPedido
                return dadosJSON
            } else
                return message.ERROR_INTERNAL_SERVER

        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}


const deletarPedido = async function (idPedido) {
    let statusId = await pedidoDAO.selectPedidoByID(idPedido);

    if (statusId) {
        if (idPedido == '' || idPedido == undefined || isNaN(idPedido)) {
            return message.ERROR_INVALID_ID; //Status code 400
        } else {
            let resultDados = await pedidoDAO.deletePedido(idPedido)

            if (resultDados) {
                return message.SUCESS_DELETED_ITEM
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        }
    } else {
        return message.ERROR_NOT_FOUND
    }

}

const getPedidos = async function () {

    let dadosPedidoJSON = {};

    let dadosPedido = await pedidoDAO.selectAllPedido();

    if (dadosPedido) {

        dadosPedidoJSON.status = message.SUCESS_REQUEST.status
        dadosPedidoJSON.message = message.SUCESS_REQUEST.message
        dadosPedidoJSON.quantidade = dadosPedido.length;
        dadosPedidoJSON.pedidos = dadosPedido
        return dadosPedidoJSON
    } else {
        return message.ERROR_NOT_FOUND
    }

}

const getPedidoPorID = async function (id) {

    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosJSON = {}

        let dados = await pedidoDAO.selectPedidoByID(id)

        if (dados) {
            dadosJSON.status = message.SUCESS_REQUEST.status
            dadosJSON.message = message.SUCESS_REQUEST.message
            dadosJSON.pedido = dados
            return dadosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

////////////////////////////////////////////////////////
const getDetalhesPedidoPorID = async function (id) {

    if (id == '' || id == undefined || isNaN(id)) {

        return message.ERROR_INVALID_ID;

    } else {

        let dadosJSON = {};

        let dados = await pedidoDAO.selectAllDetalhesPedidoById(id);

        if (dados) {
            dadosJSON.status = message.SUCESS_REQUEST.status;
            dadosJSON.message = message.SUCESS_REQUEST.message;

                //detalhes do pedido
                dadosJSON.detalhes_do_pedido = {
                id_pedido: dados[0].id_pedido,
                id_pedido_produto: dados[0].id_pedido_produto,
                id_restaurante: dados[0].id_restaurante,
                nome_restaurante: dados[0].nome_restaurante,
                numero_pedido: dados[0].numero_pedido,
                horario_pedido: dados[0].horario_pedido,
                previsao_entrega: dados[0].previsao_entrega,
                data_pedido: dados[0].data_pedido,
                valor_total: dados[0].valor_total,
                status_pedido: dados[0].status_pedido,
                id_restaurante_forma_pagamento: dados[0].id_restaurante_forma_pagamento,
                id_forma_pagamento: dados[0].id_forma_pagamento,
                nome_forma_pagamento: dados[0].nome_forma_pagamento,
                id_restaurante_frete_area_entrega: dados[0].id_restaurante_frete_area_entrega,
                id_frete_area_entrega: dados[0].id_frete_area_entrega,
                km: dados[0].km,
                valor_entrega: dados[0].valor_entrega,
                tempo_entrega: dados[0].tempo_entrega,
                raio_entrega: dados[0].raio_entrega,
                id_cliente: dados[0].id_cliente,
                nome_cliente: dados[0].nome_cliente,
                telefone_cliente: dados[0].telefone_cliente,
                produtos: []
            };

                //adicionar cada produto à array de produtos
                dados.forEach((detalhe) => {
                const produto = {
                    id_produto: detalhe.id_produto,
                    nome_produto: detalhe.nome_produto,
                    descricao_produto: detalhe.descricao_produto,
                    imagem_produto: detalhe.imagem_produto,
                    id_status_produto: detalhe.id_status_produto,
                    status_produto: detalhe.status_produto,
                    id_categoria_produto: detalhe.id_categoria_produto,
                    categoria_produto: detalhe.categoria_produto,
                };

                dadosJSON.detalhes_do_pedido.produtos.push(produto);

            });

            return dadosJSON;
        } else {
            return message.ERROR_NOT_FOUND;
        }
    }
};


const getDetalhesPedido = async function () {

        let dadosJSON = {};
        let dados = await pedidoDAO.selectAllDetalhesPedido();

        if (dados) {
        dadosJSON.status = message.SUCESS_REQUEST.status;
        dadosJSON.message = message.SUCESS_REQUEST.message;
        dadosJSON.detalhes_do_pedido = {};

    
        // Iterar sobre todos os pedidos
        dados.forEach((detalhe) => {
        const idPedido = detalhe.id_pedido;

           
                if (!dadosJSON.detalhes_do_pedido[idPedido]) {
                    dadosJSON.detalhes_do_pedido[idPedido] = {

                    id_pedido: idPedido,
                    id_restaurante: detalhe.id_restaurante,
                    nome_restaurante: detalhe.nome_restaurante,
                    numero_pedido: detalhe.numero_pedido,
                    horario_pedido: detalhe.horario_pedido,
                    previsao_entrega: detalhe.previsao_entrega,
                    data_pedido: detalhe.data_pedido,
                    valor_total: detalhe.valor_total,
                    status_pedido: detalhe.status_pedido,
                    id_restaurante_forma_pagamento: detalhe.id_restaurante_forma_pagamento,
                    id_forma_pagamento: detalhe.id_forma_pagamento,
                    nome_forma_pagamento: detalhe.nome_forma_pagamento,
                    id_restaurante_frete_area_entrega: detalhe.id_restaurante_frete_area_entrega,
                    id_frete_area_entrega: detalhe.id_frete_area_entrega,
                    km: detalhe.km,
                    valor_entrega: detalhe.valor_entrega,
                    tempo_entrega: detalhe.tempo_entrega,
                    raio_entrega: detalhe.raio_entrega,
                    id_cliente: detalhe.id_cliente,
                    nome_cliente: detalhe.nome_cliente,
                    telefone_cliente: detalhe.telefone_cliente,
                    // inicializar a lista de produtos
                    produtos: []  
                };
            }

            // adicionar produto ao pedido correspondente
            const produto = {
                id_produto: detalhe.id_produto,
                nome_produto: detalhe.nome_produto,
                descricao_produto: detalhe.descricao_produto,
                imagem_produto: detalhe.imagem_produto,
                id_status_produto: detalhe.id_status_produto,
                status_produto: detalhe.status_produto,
                id_categoria_produto: detalhe.id_categoria_produto,
                categoria_produto: detalhe.categoria_produto,
            };

            dadosJSON.detalhes_do_pedido[idPedido].produtos.push(produto);
        });

        return dadosJSON;
    } else {
        return message.ERROR_NOT_FOUND;
    }
};





module.exports = {
    inserirPedido,
    atualizarPedido,
    deletarPedido,
    getPedidos,
    getDetalhesPedidoPorID,
    getDetalhesPedido
}