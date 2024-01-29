<template>
    <div>
        <div class="list-header">
            <h1>検索</h1>
            <input type="text" placeholder="Enter Pokémon name or ID">
            <button>Search</button>
            <!-- offsetを増やして新しいポケモンデータを読み込む -->
            <button @click="loadMore">Load More</button>
        </div>
        <div class="list-main">
            <h1>一覧結果の表示場所</h1>
            <div v-for="pokemon in pokemons" :key="pokemon.id">
                <p>{{ pokemon.name }}</p>
                <p>Type: {{ pokemon.types }}</p>
                <p>Pokedex ID: {{ getPokemonId(pokemon.url) }}</p>
                <hr>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            // pokemons情報
            pokemons: [],
            // APIの取得位置
            offset: 0,
            // 1ページの表示数
            limit: 20,
        };
    },
    // コンポーネントがマウントされた瞬間に実行するメソッド
    mounted() {
        this.loadPokemons();
    },
    methods: {
        //非同期でポケモンデータを取得
        async loadPokemons() {
            try{
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${this.offset}&limit=${this.limit}`);
                this.pokemons = response.data.results;

                //ポケモンごとに非同期でタイプを取得
                for(const pokemon of this.pokemons) {
                    pokemon.types = await this.getPokemonTypes(pokemon.url);
                }
            }catch (error) {
                console.log(`Error fetching Pokemon data`, error);
            }
        },
        // タイプ取得
        async getPokemonTypes(url) {
            try {
                const response = await axios.get(url);
                const types = response.data.types.map(typeInfo => typeInfo.type.name);
                return types.join(', ');
            }catch (error) {
                console.error('Error fetching Pokemon types:', error);
                return 'Unknown';
            }
        },
        // ポケモン図鑑ID取得
        getPokemonId(url) {
            // /で分割["https:", "", "pokeapi.co", "api", "v2", "pokemon", "25", ""]配列の最後から2番目を抽出
            const id = url.split('/').slice(-2, -1)[0];
            return id;
        },
        // 次のポケモンデータの読み込み
        loadMore() {
            this.offset += this.limit;
            this.loadPokemons();
        },
    },
};
</script>

<style scoped>
.list-header {
    text-align: center;
    margin-bottom: 20px;
}

input[type="text"] {
    padding: 10px;
    margin-right: 10px;
    font-size: 16px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.list-main {
    text-align: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>
