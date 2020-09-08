import Vue from "nativescript-vue";
import _ from 'lodash';    
Object.defineProperty(Vue.prototype, '$_', { value: _ });


import preload from "./components/preload";
import FloatLabel from './components/include/FloatLabel';
//import Fonticon from "nativescript-vue-fonticon";
import Footer from "./components/include/footer";
import Header from "./components/include/header";
import CheckBox from "nativescript-checkbox";
import { TNSFontIcon, fonticon } from "nativescript-fonticon";
//TNSFontIcon.debug = true; 

import teleStore from "./components/store/teleStore";
import RadChartPlugin from 'nativescript-ui-sidedrawer/vue';



Vue.use(RadChartPlugin);
Vue.config.silent = false;

TNSFontIcon.paths = {
    fa: './assets/font_awesome.css',
};
TNSFontIcon.loadCss();

Vue.filter('fonticon', fonticon);

Vue.registerElement('CheckBox', () => require('nativescript-checkbox').CheckBox);
Vue.component('FloatLabel', FloatLabel);
Vue.component('Footer',Footer);
Vue.component('Header',Header);


new Vue({

    render: p => p('frame',[p(preload)]),
    store:teleStore
}).$start();
