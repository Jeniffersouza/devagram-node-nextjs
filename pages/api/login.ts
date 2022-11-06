/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import md5 from "md5";
import { UsuarioModel } from "../../models/UsuarioModel";
import type { UsuarioRequisicao } from "../../types/UsuarioRequisicao";

const endpointLogin = async (
  req : NextApiRequest,
  res : NextApiResponse<RespostaPadraoMsg>
) => {
  
  if(req.method === 'POST'){

    const usuario = req.body as UsuarioRequisicao;

    const usuariosEncontrados = await UsuarioModel.find({email : usuario.email, senha : md5(usuario.senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncotrado = usuariosEncontrados[0];
            return res.status(200).json({msg : `Usuario ${usuarioEncotrado.nome} autenticado com sucesso`});
        }
          return res.status(400).json({erro : 'Usuario ou senha não encontrados'})
  }
  return res.status(405).json({erro : 'Método informado não é válido!'})
}
export default conectarMongoDB(endpointLogin);