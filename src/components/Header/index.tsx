import Link from 'next/link';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { GiCharacter } from 'react-icons/gi';
import { useHeroes } from '../../hooks/useHeroes';

import styles from './styles.module.scss';

export function Header() {

  const { heroes, favoritesList } = useHeroes();
  const [activatedFavorite, setActivatedFavorite] = useState(false);

  function handleFavoriteList() {
    favoritesList(activatedFavorite)
    setActivatedFavorite(!activatedFavorite)
  }

  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href={"/"}>

            <img src="/images/logo.svg" alt="Logo Marvel" />

          </Link>
        </div>
      </header>

      <section className={styles.counterContainer}>
        <div className={styles.characterContainer}>
          <GiCharacter
            className={styles.counterCharacter}
          />
          <span> {heroes.length}</span>
        </div>

        <div>
          <FaStar
            className={styles.counterFavorite}
          />
          <span>
            {heroes.filter(hero => hero.favorite).length}</span>
        </div>

        {activatedFavorite ? (
          <button
            className={styles.buttonFavorite}
            style={{ color: '#EBA417' }}
            type='button'
            onClick={handleFavoriteList}
          >
            Favoritos
          </button>
        ) : (
          <button
            className={styles.buttonFavorite}
            style={{ color: '#CCCCCC' }}
            type='button'
            onClick={handleFavoriteList}
          >
            Favoritos
          </button>
        )
        }


      </section>



    </>
  );
}