import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface HeroesProviderProps {
  children: ReactNode;
}

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

interface Heroes {
  hero: Hero
}

interface HeroesContextData {
  heroes: Hero[],
  handleMoreHeroes: () => void,
  handleSearchHeroes: (valueSearch: string) => void,
  handleFavoriteHero: (hero: Hero) => void,
  favoritesList: (activatedFavorite: boolean) => void
}


const HeroesContext = createContext<HeroesContextData>({} as HeroesContextData);

export function HeroesProvider({ children }: HeroesProviderProps): JSX.Element {

  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [amountCharacters, setAmountCharacters] = useState(0);


  useEffect(() => {
    const storageHeroes = localStorage.getItem('@HeroesMarvel');
    const storageAmountCharacters = localStorage.getItem('@HeroesMarvel:amountCharacters')

    if (storageHeroes) {
      if (!heroes.length) {
        setHeroes(JSON.parse(storageHeroes));
        if (!amountCharacters) {
          setAmountCharacters(JSON.parse(storageAmountCharacters));
        }
      }

      return
    }

    api.get('/characters')
      .then(res => {
        const resultHeroes = res.data.data.results;

        setHeroes(resultHeroes);
        updateLocalStorage(resultHeroes);

        setAmountCharacters(resultHeroes.length);
        updateLocalStorageAmount(resultHeroes.length);

      })
      .catch(err => console.log(err.message));
  }, []);

  const handleMoreHeroes = useCallback(async () => {
    try {
      const offset = amountCharacters

      const response = await api.get('/characters', {
        params: {
          offset
        }
      });

      const resultHeroes = response.data.data.results;

      const localHeroes = getLocalStorage();

      const newHeroes = (localHeroes.length > amountCharacters) ?
        [...localHeroes, ...resultHeroes].sort((a, b) => a.name < b.name ? -1 : 1) :
        [...heroes, ...resultHeroes];

      setHeroes(newHeroes);
      updateLocalStorage(newHeroes);

      setAmountCharacters(amountCharacters + 20);
      updateLocalStorageAmount(amountCharacters + 20);

    } catch (error) {
      console.log(`error: ${error.message}`);
    }
  }, [heroes, amountCharacters]);

  const handleSearchHeroes = async (valueSearch: string) => {
    try {
      const nameStartsWith = valueSearch
      if (nameStartsWith) {

        const response = await api.get('/characters', {
          params: {
            nameStartsWith,
            limit: 100
          }
        });

        const resultHeroes = response.data.data.results;

        setHeroes(resultHeroes);


        const localHeroes = getLocalStorage();

        const newHeroesLocal = [...localHeroes, ...resultHeroes];

        const newHeroes = newHeroesLocal.reduce((acc, current) => {
          if (
            !acc.some((item: Hero) => item.id === current.id)
          ) {
            acc.push(current)
          }
          return acc
        }, []);


        const sortedHeroes = newHeroes.sort((a: Hero, b: Hero) => a.name < b.name ? -1 : 1);
        updateLocalStorage(sortedHeroes);

      }
    } catch (error) {
      console.log(`error: ${error.message}`);
    }
  };

  const handleFavoriteHero = useCallback(async (hero: Hero) => {
    try {

      const heroesUpdate = heroes.map(heroUpdate =>
        heroUpdate.id === hero.id ? {
          ...heroUpdate,
          favorite: !heroUpdate.favorite
        } : heroUpdate
      );

      setHeroes(heroesUpdate);

      const localHeroes = getLocalStorage();

      if (heroesUpdate.length === localHeroes.length) {
        updateLocalStorage(heroesUpdate)
      } else {
        const localHeroesUpdate = localHeroes.map(heroUpdate =>
          heroUpdate.id === hero.id ? {
            ...heroUpdate,
            favorite: !heroUpdate.favorite
          } : heroUpdate
        );

        updateLocalStorage(localHeroesUpdate)

      }

    } catch (error) {
      console.log(`error: ${error.message}`);
    }
  }, [heroes]);

  const favoritesList = useCallback(async (activatedFavorite: boolean) => {

    const localHeroes = getLocalStorage()

    const favoritesHeroes = activatedFavorite ? localHeroes : localHeroes.filter(hero => hero.favorite)

    setHeroes(favoritesHeroes)

  }, [heroes]);

  function getLocalStorage(): Hero[] {
    const storageHeroes = localStorage.getItem('@HeroesMarvel');
    return JSON.parse(storageHeroes);
  }

  function updateLocalStorage(heroes: Hero[]) {
    localStorage.setItem('@HeroesMarvel', JSON.stringify(heroes));
  }

  function updateLocalStorageAmount(amount: number) {
    localStorage.setItem('@HeroesMarvel:amountCharacters', JSON.stringify(amount));
  }


  return (<HeroesContext.Provider
    value={{ heroes, handleMoreHeroes, handleSearchHeroes, handleFavoriteHero, favoritesList }}
  >
    {children}
  </HeroesContext.Provider>);
}

export const useHeroes = () => {
  return useContext(HeroesContext);
};