import type { NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import nc from 'next-connect'
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic'
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";
import { politicaCORS } from "../../middlewares/politicaCORS";

const handler = nc ()
  .use(upload.single('file'))
  .post(
    
    async (req : any, res : NextApiResponse<RespostaPadraoMsg>) => {

      try {

      const {userId} = req.query;
      const usuario = await UsuarioModel.findById(userId);
      if(!usuario){
        return res.status(400).json({erro : 'Usuario não encontrado'});
      }


      if(!req || !req.body){
            return res.status(400).json({erro : 'Parametros não informados'});
          }

      const {descricao} = req?.body;

      if(!descricao || descricao.length < 2){
        return res.status(400).json({erro : 'Descrição invalida'});
      }
      if(!req.file || !req.file.originalname){
        return res.status(400).json({erro : 'Imagem invalida'});
      }

      const image = await uploadImagemCosmic(req);

      const publicacao = {
        idUsuario : usuario._id,
        descricao,
        foto : image.media.url,
        data : new Date()
      }

      await PublicacaoModel.create(publicacao);

      return  res.status(200).json({msg : 'Publicação Criada com sucesso!'});


      } catch (e) {
        console.log(e)
        return res.status(400).json({erro : 'NÃO FOI POSSIVEL PUBLICAR SUA PUBLICAÇÃO!'});
      }
  });


  export const config = {
    api: {
        bodyParser : false
    }
  }

export default politicaCORS(validarTokenJWT(conectarMongoDB(handler)));