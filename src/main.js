import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

// FontAwesome のインポート
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowRight, faArrowLeft} from '@fortawesome/free-solid-svg-icons';

// 使用するアイコンを library に追加
library.add(faArrowRight, faArrowLeft);

// アプリケーションの作成と設定
const app = createApp(App);
app.component('FontAwesomeIcon', FontAwesomeIcon); // FontAwesomeIcon をグローバルコンポーネントに登録
app.use(router).mount('#app')
