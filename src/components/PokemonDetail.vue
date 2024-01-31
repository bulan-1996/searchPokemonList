<template>
    <div class="pokemon-details">
        <div>
            <h1>{{ pokemon.name }}</h1>
            <p>図鑑番号:{{ pokemon.id }}</p>
            <p>身長:{{ pokemon.height }}</p>
            <p>重さ:{{ pokemon.weight }}</p>
            <p>タイプ:{{ pokemon.types }}</p>
        </div>
        <div>
            <img :src="pokemonImage" alt="Pokemon Image" />
        </div>
        <div>
            <h2>能力値</h2>
            <p v-for="stat in stats" :key="stat.name">{{ stat.labal }}: {{ stat.value }}</p>
        </div>
        <div>
            <div v-if="evolutionData.chain">
            <h2>進化情報</h2>
                <div v-for="evolution in evolutionData.chain.evolves_to" :key="evolution.species.name">
                    <p>Species: {{ evolution.species.name }}</p>
                    <!-- その他の進化情報表示... -->
                </div>
            </div>
        </div>
        <div>
            <h2>技一覧</h2>
            <ul>
                <li v-for="move in pokemonMoves" :key="move">
                {{ move }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            pokemon:{},
            evolutionData:{},
            pokemonMoves:[],
            stats: [
                { name: 'hp', labal: 'HP', value: 'Loading...' },
                { name: 'attack', labal: '攻撃', value: 'Loading...' },
                { name: 'defense', labal: '防御', value: 'Loading...' },
                { name: 'special-attack', labal: '特攻', value: 'Loading...' },
                { name: 'special-defense', labal: '特防', value: 'Loading...' },
                { name: 'speed', labal: '速さ', value: 'Loading...' },
            ],
            pokemonImage: null,
        };
    },
    async created() {
        // ポケモンの詳細データを取得
        // $route.params.idを用いてidを取得する。
        const pokemonId = this.$route.params.id;
        await this.loadPokemonData(pokemonId);
    },
    methods: {
        async loadPokemonData(pokemonId) {
            try {
                //ポケモンの基礎情報を取得する。
                const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
                const response = await axios.get(apiUrl);
                this.pokemon = response.data;
                this.pokemon.types = await this.getPokemonTypes(response);
                // 画像情報の取得
                this.pokemonImage = response.data.sprites.front_default;
                // ステータス情報を非同期で取得
                await this.loadStats(response);

                //進化情報のURLを取得
                 const speciesResponse = await axios.get(this.pokemon.species.url);
                 const evolutionDataURL = speciesResponse.data.evolution_chain.url;
                //ポケモンの進化情報を取得
                const evolutionResponse = await axios.get(evolutionDataURL);
                this.evolutionData = evolutionResponse.data;

                // movesからmove.nameのリストを取得
                const moveNames = response.data.moves.map(moveData => moveData.move.name);
                // 取得したデータをVueのデータにセット
                this.pokemonMoves = moveNames;
            } catch (error) {
                console.error(`Error fetching Pokemon data from:`, error);
            }
        },
        // タイプを取得するメソッド
        getPokemonTypes(response) {
            return response.data.types.map(type => type.type.name).join(', ');
        },
        // ステータス情報を取得するメソッド
        async loadStats(response) {
            try {
                this.pokemon.stats = response.data.stats;
                // ステータス情報を取得した後、テンプレートで表示するデータを更新
                this.updateStatData();
            } catch (error) {
                console.error(`Error fetching Pokemon stats:`, error);
            }
        },
        // ステータス情報を更新するメソッド
        updateStatData() {
            if (this.pokemon && this.pokemon.stats) {
                this.stats.forEach(stat => {
                    const statInfo = this.pokemon.stats.find(s => s.stat.name === stat.name);
                    stat.value = statInfo ? statInfo.base_stat : 'Unknown';
                });
            } else {
                this.stats.forEach(stat => {
                    stat.value = 'Unknown';
                });
            }
        },
    },
};
</script>
<style>
.pokemon-details {
    max-width: 600px;
    margin: 0 auto;
    padding:20px;
}

/*ステータス情報のスタイル */
.pokemon-details h2 {
    color: #333;
    font-size: 1.5em;
    margin-bottom: 10px;
}

.pokemon-details p {
    margin: 5px 0;
}

/*画像のスタイル*/
.pokemon-details img {
    max-width: 100%;
    height:auto;
    margin-bottom:20px;
}

/*技一覧のスタイル*/
.pokemon-details ul {
    list-style-type: none;
    padding: 0;
}

.pokemon-details li {
    margin-bottom: 5px;
}
</style>
