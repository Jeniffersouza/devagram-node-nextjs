import { NextApiRequest, NextApiResponse, NextApiHandler } from "next"
import mongoose  from "mongoose";
import type { RespostaPadraoMsg } from "../types/RespostaPadraoMsg";

export const conectarMongoDB = (handler : NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
  //verificar se o banco já está conectado, se sim segue para endpoint
  //ou poximo middleware
  if(mongoose.connections[0].readyState){
    return handler(req, res);
  }
  //ja que não esta conectado vamos conectar
  //obter a variavel prenchida do  env
  const {DB_CONEXAO_STRING} = process.env;
  if(!DB_CONEXAO_STRING){
    return res.status(500).json({erro: 'ENV de configuração do banco não informada!'});
  }

  mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar no banco: ${error}`))
  mongoose.connection.on('connected', () => console.log('Banco de dados conectado!'))
  await mongoose.connect(DB_CONEXAO_STRING)
  //agora posso seguir com o endpoint pois estou conectado ao banco
  return handler(req, res);
}