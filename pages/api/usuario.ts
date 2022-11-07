import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";

const endpointUsuario = (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
  return res.status(200).json({ msg : 'usuario autenticado com sucesso!'})

}

export default validarTokenJWT(endpointUsuario,)