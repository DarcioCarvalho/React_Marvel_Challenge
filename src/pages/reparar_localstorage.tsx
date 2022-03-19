import Head from "next/head";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

import styles from './home.module.scss';

interface Hero {
  id: number,
  name: string,
  modified: string,
  thumbnail: {
    path: string,
    extension: string,
  },
  favorite?: boolean
}


export default function Reparar_localstorage() {

  const [message, setMessage] = useState('')


  /* if (message === '') {
    'Dados do LocalStorage reparados com sucesso!!!'
  } */

  // function repararLocalStorage() {

  useEffect(() => {

    try {
      const storageHeroes = localStorage.getItem('@HeroesMarvel');
      const localHeroes: Hero[] = JSON.parse(storageHeroes);

      //throw Error('ERRO Forçado!!!');

      console.log('localHeroes: ', localHeroes)

      const newHeroesLocal = [...localHeroes];

      /* const newHeroes = newHeroesLocal.reduce((unique: Hero[], item) =>
        (unique.includes(item) ? unique : [...unique, item])
        , []); */

      const newHeroes = newHeroesLocal.reduce((acc, current) => {
        if (
          !acc.some((item) => item.id === current.id)
        ) {
          acc.push(current)
        }
        return acc
      }, []);

      console.log('Heroes Únicos: ', newHeroes)

      const sortedHeroes = newHeroes.sort((a, b) => a.name < b.name ? -1 : 1);
      localStorage.setItem('@HeroesMarvel', JSON.stringify(sortedHeroes))
      setMessage('OK')
    } catch (e) {
      console.log('MESSAGE #1: ', e.message)
      setMessage(e.message)
    }
  }, [])


  return (
    <>
      <Head>
        <title>Reparar dados no Local Storage... | Marvel Challenge | DNC Soluções em Software</title>
      </Head>

      <Header />

      <main className={`${styles.homeContainer} ${styles.message}`}>
        <h1 >REPARAR DADOS NO LOCAL STORAGE!!!</h1>

        {/* <Button
          titleButton={'Iniciar reparo'}
          colorTitle={'#FFFFFF'}
          bgColor={'#700611'}
          onClick={repararLocalStorage}
        /> */}

        {(message !== '') &&
          (message.includes('OK') ?
            (<h1> {'Dados do LocalStorage reparados com sucesso!!!'} </h1>) :
            (<>
              <h1> {'Houve o seguinte erro ao reparar os dados do LocalStore'}</h1>
              <h2> {message} </h2>
            </>))
        }

      </main>

    </>
  )
}