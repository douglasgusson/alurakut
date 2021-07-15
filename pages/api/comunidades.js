import { SiteClient } from 'datocms-client';

const ID_MODELO_COMUNIDADE = '971877';

export default async function recebedorDeRequests(request, response) {

  if (request.method === 'POST') {

    response.status(501).json({
      message: 'Ops! Esta funcionalidade não está disponível.'
    })

    return;

    // const client = new SiteClient(process.env.TOKEN_CMS_FULL);
    // const cominidade = await client.items.create({
    //   itemType: ID_MODELO_COMUNIDADE,
    //   ...request.body,
    // })

    // response.json(cominidade);
    // return;
  }

  response.status(405).json({
    message: 'Não temos nada no GET!'
  })
}