/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";

export default(
  req : NextApiRequest,
  res : NextApiResponse
) => {
  if(req.method === 'POST'){
    const {login, senha} = req.body;
    
    if (login === 'admin@admin.com' &&
          senha === 'admin@123'){
            res.status(200).json({msg : 'USUARIO AUTENTICADO COM SUCESSO'})
          }
          return res.status(400).json({erro : 'Usuario ou senha não encontrados'})
  }
  return res.status(405).json({erro : 'Método informado não é válido!'})
}