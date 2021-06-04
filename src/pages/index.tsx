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

interface HomeProps {
	pokemons: {
		count: number,
		next: string,
		previus: string,
		results: Array<PokemonItemProps>,
	}
}

export default function Home({ pokemons }: HomeProps) {
	const generatePokemons = () => {
		return pokemons.results.map((pokemon) => {
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
					</div>
				</div>
			</main>
		</div>
	)

}

export const getStaticProps: GetStaticProps = async () => {
	const response = await client.query({
		query: gql`
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
		`,
		variables:{
			limit: 18,
			offset: 0
		}
	});

	console.log(response);

	return{
		props: {
			pokemons: response.data.pokemons
		}
	}
}