import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { Search } from '../components/Search';
import { useHeroes } from '../hooks/useHeroes';
import { FaStar } from 'react-icons/fa'

import styles from './home.module.scss';

export default function Home() {

  const { handleMoreHeroes, heroes, handleSearchHeroes, handleFavoriteHero } = useHeroes();
  const [valueSearch, setValueSearch] = useState('');

  return (
    <>
      <Head>
        <title>Marvel Challenge | DNC Soluções em Software</title>
      </Head>

      <Header />

      <main className={styles.homeContainer}>

        <section className={styles.searchContainer}>
          <Search
            placeholder={'Procure por Avangers, Spider-man, Balder ...'}
            name={'searchHero'}
            onBlur={(e) => setValueSearch(e.target.value)}
          />
          <Button
            titleButton={'Pesquisar'}
            colorTitle={'--white-100'}
            bgColor={'--red-900'}
            onClick={() => handleSearchHeroes(valueSearch)}
          />
        </section>

        <section id='sectionHeroes' className={styles.sectionHeroes}>
          {heroes.length ? (
            <ul className={styles.cardsContainer}>

              {heroes.map(hero => (
                <li key={hero.id}>
                  {
                    <FaStar
                      className={styles.starCard}
                      onClick={() => handleFavoriteHero(hero)}
                      style={hero.favorite ? { color: '#EBA417' } : {}}
                    />
                  }

                  <Link href={`/heroDetails/${hero.id}`}>
                    <a>
                      <Card
                        title={hero.name}
                        image={`url(${hero.thumbnail.path}.${hero.thumbnail.extension})`}
                      />
                    </a>
                  </Link>
                </li>
              ))}

            </ul>
          ) : (
            valueSearch !== '' &&
            <h3>Nenhuma informação foi encontrada para a busca realizada</h3>
          )}

          <Button
            titleButton={'Buscar mais heróis'}
            colorTitle={'--white-100'}
            bgColor={'--red-900'}
            onClick={handleMoreHeroes}
          />

        </section>
      </main>
    </>
  );
}
