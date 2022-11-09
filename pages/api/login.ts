/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import md5 from "md5";
import { UsuarioModel } from "../../models/UsuarioModel";
import type { LoginResposta } from "../../types/LoginResposta";
import jwt from  'jsonwebtoken';
import { politicaCORS } from "../../middlewares/politicaCORS";

const endpointLogin = async (
  req : NextApiRequest,
  res : NextApiResponse<RespostaPadraoMsg | LoginResposta >
) => {
  const {MINHA_CHAVE_JWT} = process.env;
  if(!MINHA_CHAVE_JWT){
    return res.status(500).json({erro : 'ENV JWT não informado!'})
  }

  if(req.method === 'POST'){

    const usuario = req.body;

    const usuariosEncontrados = await UsuarioModel.find({email : usuario.email, senha : md5(usuario.senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncotrado = usuariosEncontrados[0];

            const token = jwt.sign({_id : usuarioEncotrado._id}, MINHA_CHAVE_JWT)

            return res.status(200).json({nome : usuarioEncotrado.nome, email : usuarioEncotrado.email, token });
        }
          return res.status(400).json({erro : 'Usuario ou senha não encontrados'})
  }
  return res.status(405).json({erro : 'Método informado não é válido!'})
}
export default politicaCORS(conectarMongoDB(endpointLogin));