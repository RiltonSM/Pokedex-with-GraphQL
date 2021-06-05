import { GetStaticProps } from 'next';
import Head from 'next/head';
import { gql } from '@apollo/client';

//Service
import client from '../services/index';

//Components
import PokemonItem from '../components/PokemonItem';

//Styles
import styles from '../styles/Home.module.css';

import { PokemonItemProps } from '../components/PokemonItem';
import { useEffect, useState } from 'react';

interface HomeProps {
	pokemons: {
		count: number,
		next: string,
		previus: string,
		results: Array<PokemonItemProps>,
	}
}

const GET_POKEMONS = gql`
	query pokemons($limit: Int, $offset: Int) {
		pokemons(limit: $limit, offset: $offset) {
			count
			next
			previous
			status
			message
			results {
				id
				url
				name
				image
			}
		}
	}
`

export default function Home({ pokemons }: HomeProps) {
	const [offset, setOffset] = useState(0);
	const [page, setPage] = useState(0);
	const [loadMore, setLoadMore] = useState(true);
	const [pokemonsBuffer, setPokemonsBuffer] = useState(pokemons);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	useEffect(() => {
		const getMorePokemons = async () => {
			console.log(page, offset)
			const { data } = await client.query({
				query: GET_POKEMONS,
				variables: {
					limit: 18,
					offset
				}
			});
	
			setPokemonsBuffer({
				...data.pokemons,
				results: [
					...pokemonsBuffer.results,
					...data.pokemons.results
				]
			});

			setIsButtonDisabled(false);
		}
		if(page > 0){
			getMorePokemons();
		}
	}, [offset]);

	useEffect(() => {
		setOffset(18 * page)
	}, [page])

	const nextPage = async () => {
		setPage((lastPage) => lastPage + 1);
		setIsButtonDisabled(true);
	}


	const generatePokemons = () => {
		return pokemonsBuffer.results.map((pokemon) => {
			const image = pokemon.image.replace('pokemon/', 'pokemon/other/official-artwork/');
			return (
				<PokemonItem
					key={pokemon.id}
					id={pokemon.id.toString().padStart(3, "0")}
					image={image}
					name={pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
					url={pokemon.url}
				/>
			)
		})
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>Pokedex</title>
			</Head>
			<header className={styles.header}>
				<div className={styles.whiteCircle}>
					<div className={styles.blueCircle}/>
				</div>
			</header>

			<main className={styles.content}>
				<div className={styles.pokedexBorder}>
					<div className={styles.pokedexScreen}>
						{ generatePokemons() }

						<button className={styles.morePokemonsButton} disabled={isButtonDisabled} onClick={nextPage}>
							Carregar mais pokemons
						</button>
					</div>
				</div>
			</main>
		</div>
	)

}

export const getStaticProps: GetStaticProps = async () => {
	const response = await client.query({
		query: GET_POKEMONS,
		variables:{
			limit: 18,
			offset: 0
		}
	});

	return{
		props: {
			pokemons: response.data.pokemons
		}
	}
}