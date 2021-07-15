import { useEffect, useState } from 'react';

import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';


async function buscarPerfil(usuario) {
  const data = await fetch(`https://api.github.com/users/${usuario}`);
  if (!data.ok) return {};
  const json = await data.json();
  const { id, login, name, avatar_url, followers, following } = json;
  return {
    id: id,
    name: name,
    title: login,
    image: avatar_url,
    followers: followers,
    following: following
  }
}

async function listarSeguidores(username) {
  const data = await fetch(`https://api.github.com/users/${username}/followers`);
  if (!data.ok) return [];
  const json = await data.json();
  const seguidores = json.map(({ id, login, avatar_url }) => ({ id: id, title: login, image: avatar_url }))
  return seguidores;
}

async function listarSeguidos(username) {
  const data = await fetch(`https://api.github.com/users/${username}/following`);
  if (!data.ok) return [];
  const json = await data.json();
  const seguidores = json.map(({ id, login, avatar_url }) => ({ id: id, title: login, image: avatar_url }))
  return seguidores;
}

async function listarComunidades() {
  // API GraphQL
  const response = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Authorization': process.env.NEXT_PUBLIC_TOKEN_CMS_READ_ONLY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      "query": `query {
        allComunidades {
          id
          nome
          imagemUrl
        }
      }` })
  });

  if (!response.ok) return [];

  const { data } = await response.json();
  const { allComunidades } = data;

  const comunidades = allComunidades.map(({ id, nome, imagemUrl }) => ({ id: id, title: nome, image: imagemUrl }));

  return comunidades;
}

function ProfileSidebar({ githubUser }) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${githubUser}`}>
          @{githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox({ items, title, limit, total }) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title} ({total})
      </h2>
      <ul>
        {items.slice(0, limit).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`https://github.com/${itemAtual.title}`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {

  const githubUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
  const itemsLimit = process.env.NEXT_PUBLIC_ITEMS_LIMIT;

  const [perfil, setPerfil] = useState({});
  const [seguidores, setSeguidores] = useState([]);
  const [seguidos, setSeguidos] = useState([]);
  const [comunidades, setComunidades] = useState([]);

  useEffect(async () => {
    setPerfil(await buscarPerfil(githubUsername));
    setSeguidores(await listarSeguidores(githubUsername));
    setSeguidos(await listarSeguidos(githubUsername));
    setComunidades(await listarComunidades());
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={perfil.title} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={perfil.title} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo, {perfil.name}
            </h1>

            <OrkutNostalgicIconSet confiavel={3} legal={3} sexy={2} />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                nome: dadosDoForm.get('title'),
                imagemUrl: dadosDoForm.get('image')
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              }).then(async (response) => {
                const dados = await response.json();
                console.log(dados);
              });

            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Comunidades" items={comunidades} limit={itemsLimit} total={comunidades.length} />
          <ProfileRelationsBox title="Pessoas seguidoras" items={seguidores} limit={itemsLimit} total={perfil.followers} />
          <ProfileRelationsBox title="Pessoas seguidas" items={seguidos} limit={itemsLimit} total={perfil.following} />
        </div>
      </MainGrid>
    </>
  )
}
