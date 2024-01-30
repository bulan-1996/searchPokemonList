import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import(/* webpackChunkName: "toplist" */ '../components/TopList.vue'),
        name: 'TopList',
    },
    {
        path: '/pokemon/:id', // パスの一部を動的にするために:idを使用
        component: () => import(/* webpackChunkName: "pokemondetail" */ '../components/PokemonDetail.vue'),
        name: 'PokemonDetail',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
