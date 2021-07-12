import { useEffect, useState } from 'react';

import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';


async function listarSeguidores(usuario) {
  const data = await fetch(`https://api.github.com/users/${usuario}/followers`);
  if (!data.ok) return [];
  const json = await data.json();
  const seguidores = json.map(({ login }) => login)
  return seguidores;
}


function ProfileSidebar(propriedades) {
  console.log(propriedades);
  return (
    <Box>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
    </Box>
  )
}

export default function Home() {

  const meuUsuario = 'douglasgusson';
  const [seguidores, setSeguidores] = useState([])

  useEffect(async () => {
    setSeguidores(await listarSeguidores(meuUsuario));
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={meuUsuario} />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={meuUsuario} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet confiavel={3} legal={3} sexy={2} />
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Meus seguidores ({seguidores.length})
            </h2>

            <ul>
              {seguidores.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
