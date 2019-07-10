import Vue from "nativescript-vue";
import _ from 'lodash';    
Object.defineProperty(Vue.prototype, '$_', { value: _ });


import Home from "./components/Home";
import FloatLabel from './components/include/FloatLabel';
//import Fonticon from "nativescript-vue-fonticon";
import Footer from "./components/include/footer";
import Header from "./components/include/header";
import CheckBox from "nativescript-checkbox";
import { TNSFontIcon, fonticon } from "nativescript-fonticon";
//TNSFontIcon.debug = true; 

import teleStore from "./components/store/teleStore";

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

    render: h => h('frame',[h(Home)]),
    store:teleStore
}).$start();
