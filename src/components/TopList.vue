<template>
    <div>
        <div class="list-header">
            <h1>検索</h1>
            <input type="text" placeholder="Enter Pokémon name or ID">
            <button>Search</button>
            <!-- offsetを増やして新しいポケモンデータを読み込む -->
            <button @click="loadMore">Load More</button>
        </div>
        <h1>一覧結果の表示場所</h1>
        <div class="pokemon-container">
            <div v-for="pokemon in pokemons" :key="pokemon.id" class="pokemon-card" @click="goToPokemonDetail(pokemon.pokemonId)">
                <img :src="pokemon.image" alt="Pokemon Image" />
                <p>{{ pokemon.name }}</p>
                <!-- types と pokemonId を非表示にして値を保持 -->
                <p class="hidden">{{ pokemon.types }}</p>
                <p class="hidden">{{ pokemon.pokemonId }}</p>
            </div>s
        </div>
        <div class="pagination-container">
            <div class="half-page" @click="goToPreviousPage">
                <FontAwesomeIcon icon="arrow-left" class="arrow-icon"/>
            </div>
            <div class="half-page" @click="goToNextPage">
                 <FontAwesomeIcon icon="arrow-right" class="arrow-icon"/>
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
            limit: 24,
            // 画像表示
            pokemonImage: [],
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

                //ポケモンごとに非同期で取得
                for(const pokemon of this.pokemons) {
                    pokemon.types = await this.getPokemonTypes(pokemon.url);
                    const detailResponse = await axios.get(pokemon.url);
                    // 画像情報はspritesオブジェクトの中にあります
                    pokemon.image = detailResponse.data.sprites.front_default;
                    pokemon.pokemonId = await this.getPokemonId(pokemon.url);
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
        goToNextPage() {
            this.offset += this.limit;
            this.loadPokemons();
        },
        // 前のポケモンデータの読み込み
        goToPreviousPage() {
            this.offset -= this.limit;
            this.loadPokemons();
        },
        goToPokemonDetail(pokemonId) {
            // PokemonDetailページに遷移
            this.$router.push({ name: 'PokemonDetail', params: {id: pokemonId}});
        }
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

.pokemon-container {
    display: flex;
    flex-wrap:wrap;
    justify-content: space-between;
}
.pokemon-card {
    width: calc(16.666% - 10px); /*一列に6つ並べるための幅*/
    margin-bottom: 20px;
    text-align: center;
    transition: background-color 0.3s ease; /* 色が変わるアニメーションを追加 */
}
.pokemon-card:hover {
    background-color: #f0f0f0; /* マウスホバー時の背景色 */
  }
.pokemon-card img {
    max-width: 100%;
    height: auto;
}
/* 追加: types と pokemonId を非表示にするスタイル */
  .pokemon-card p.hidden {
    display: none;
  }
 .pagination-container {
    display: flex;
    justify-content: space-between;
    width: 50%; /* 親コンテナの半分の幅を使用 */
    margin: 0 auto; /* 中央揃え */
  }
 .half-page {
    cursor: pointer;
    transition: background-color 0.3s ease; /* 背景色が変わるアニメーションを追加 */
 }
  .arrow-icon {
    font-size: 24px; /* アイコンの大きさを調整 */
  }

  .half-page:hover {
    background-color: #f0f0f0; /* マウスホバー時の背景色 */
  }
</style>
