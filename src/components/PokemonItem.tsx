import styles from '../styles/PokemonItem.module.css';

export interface PokemonItemProps {
    id: string;
    name: string;
    image: string;
    url: string;
}

const PokemonItem = ({ id, image, name, url}: PokemonItemProps) => {
    return(
        <div className={styles.container}>
            <div className={styles.pokemonImgContainer}>
                <img src={image} alt={`#${id} ${name}`} className={styles.pokemonImg}/>
            </div>

            <div className={styles.pokemonInfoContainer}>
                <p className={styles.pokemonNumber}>#{id}</p>
                <p className={styles.pokemonName}>{name}</p>
            </div>
        </div>
    )
}

export default PokemonItem;