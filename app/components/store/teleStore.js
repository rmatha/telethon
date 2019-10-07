import Vue from 'nativescript-vue';
import axios from 'axios'
import * as ApplicationSettings from "application-settings";
	
const Vuex = require("vuex");

const Sqlite = require("nativescript-sqlite");

Vue.use(Vuex);
	

const store = new Vuex.Store({
    state: {
		debug : false,
        
		
		affichageDefiType : null,
		connexion : null,
		database: null,
        data: [],
		versionCategorie : "0",
		versionDefi : "0",
		versionEquipe : "0",
		updateCategorie : false,
		updateDefi : false,
		updateEquipe : false,
		selectedParticipant : null,
		selectedCommune : null,
		selectedCategorie : {},
		selectedDefi : null,
		selectedScore : null,
		selectedEquipe : null,
		isAdmin : true,
		isOrganisateur : true,
		participants: [],
		categories: [],
		defis: [],
		defisCommune: [],
		defisEquipe: [],
		scoresEquipe: [],
		equipes : [],
		scores : []
    },
	actions : {
		init(state) {
			console.log("TELESTORE : INIT : state : "+JSON.stringify(state));
			console.log("TELESTORE : INIT : state : "+JSON.stringify(this.state));
            if(ApplicationSettings.getString("store")) {
                this.replaceState(
                    Object.assign(this.state, JSON.parse(ApplicationSettings.getString("store")))
                );
            }
			console.log("chargement du store terminé : "+JSON.stringify(this.state)); 
			return true;
        },
        
        setSelectedEquipe(context,data) {
			console.log("TELESTORE : setSelectedEquipe : data : "+JSON.stringify(data));
			console.log("TELESTORE : setSelectedEquipe : state : "+JSON.stringify(this.state));
			this.state.selectedEquipe = data.equipe;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			
		},
		
		
		resetVersion(state) {
			this.state.versionCategorie = 0;
			this.state.versionDefi = 0;
			this.state.versionEquipe = 0;
			console.log("telestore : resetConfig : "+JSON.stringify(this.state));
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		setVersionEquipe(state,data) {
			this.state.versionEquipe = data.version;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		reloadDefis(state,data) {
			this.state.defis = data.defis;
			this.state.versionDefi = data.version;
			console.log("Nombre de defis en local : "+this.state.defis.length); 
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		reloadEquipes(state, data) {
            this.state.equipes = data.equipes;
			this.state.versionEquipe = data.version;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : reloadEquipes : Nombre d'équipe en base : "+this.state.equipes.length); 
        },
		
		
		
		
		setVersionEquipe(state,data) {
		    this.state.selectedEquipe.version = data.version;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : setParticipants : Version de l'équipe : "+this.state.selectedEquipe.version); 
		
		},
		
		newEquipe(state,data) {
			this.state.selectedEquipe = data.equipe;
			this.state.equipes.push(data.equipe);
			this.state.participants = [];
			this.state.defisEquipe = [];
			this.state.scoresEquipe = [];
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		
		
		/**
		categorie
		**/
		
		reloadCategories(state,data) {
            this.state.categories = data.categories;
			this.state.versionCategorie = data.version;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : reloadCategories : Nombre de catégories en base : "+this.state.categories.length); 
	
		},
		
		
		addCategorie(state,data) {
			this.state.categories.push(data.categorie);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		updateCategorie(state,data) {
			console.log("TESTORE : UPDATECATEGORIE : categorie sélectionnée "+JSON.stringify(this.state.selectedCategorie));
			var indexCategorie = this.state.categories.findIndex(item => {
					return item.nom == this.state.selectedCategorie.nom;
				});
			// mise a jour des informations
			console.log("TESTORE : UPDATECATEGORIE : index récupéré : "+indexCategorie);
			this.state.categories[indexCategorie].nom = data.categorie.nom;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de categories après update : "+JSON.stringify(this.state.categories));
		},
		deleteCategorie(state) {
			console.log("Nombre de categorie avant suppression : "+JSON.stringify(this.state.categories));
			this.state.categories = this.state.categories.filter(item => {
					return item.nom !== this.state.selectedCategorie.nom;
				});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de categories après suppression : "+JSON.stringify(this.state.categories));
		},
		
		
		/**
		participants
		**/
		
		addParticipant(state,data) {
			this.state.participants.push(data.participant);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		deleteParticipant(state,data) {
			console.log("Nombre de particpants avant suppression : "+JSON.stringify(this.state.participants));
			this.state.participants = this.state.participants.filter(item => {
					return item.nom !== data.participant.nom;
				});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de particpants après suppression : "+JSON.stringify(this.state.participants));
		},
		
		setParticipants(state,data) {
		    console.log("TELESTORE : setParticipants : Liste des particpants : "+JSON.stringify(data));
			this.state.participants = data.participants;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : setParticipants : Nombre de participants en base : "+this.state.participants.length); 
		},
	
		updateParticipant(state,data) {
			var indexParticipant = this.state.participants.findIndex(item => {
					return item == this.state.selectedParticipant;
				});
			// mise a jour des informations
			this.state.participants[indexParticipant].nom = data.participant.nom;
			this.state.participants[indexParticipant].commune = data.participant.commune;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de particpants après suppression : "+JSON.stringify(this.state.participants));
		},
		
		setSelectedParticipant(state,data) {
			this.state.selectedParticipant = data.participant;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		insertScore(state,data) {
			console.log("TELESTORE : insertScore : score en cours : "+JSON.stringify(data));
			this.state.scoresEquipe.push(data.score);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : insertScore : liste des scores : "+this.state.scoresEquipe.length); 
		},
		
		updateScore(state,data) {
			var indexScore = this.state.scoresEquipe.findIndex(item => {
					return item == this.state.selectedScore;
				});
			// mise a jour des informations
			this.state.scoresEquipe[indexScore] = data.score;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de particpants après suppression : "+JSON.stringify(this.state.participants));
		},
		deleteScore(state,data) {
			this.state.scoresEquipe = this.state.scoresEquipe.filter(score => {
				return score !== data.score;
			});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		
		
		deleteDefi(state,data) {
			console.log("Nombre de défis avant suppression : "+this.state.defis.length);
			this.state.defis = this.state.defis.filter(defi => {
				return defi !== data.defi;
			});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de défis après suppression : "+this.state.defis.length);
		},
		
		deleteDefisCurrentCommune(state,data) {
			console.log("Nombre de défis commune avant suppression : "+this.state.defisCommune.length);
			this.state.defisCommune = this.state.defisCommune.filter(item => {
				return item !== data.defi;
			});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de défis commune après suppression : "+this.state.defisCommune.length);
		},
		
		deleteDefisEquipe(state,data) {
			console.log("Nombre de défis equipe avant suppression : "+this.state.defisEquipe.length);
			this.state.defisEquipe = this.state.defisEquipe.filter(item => {
				return item !== data.defi;
			});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de défis equipe après suppression : "+this.state.defisEquipe.length);
		},
		
		insertDefisCurrentCommune(state,data) {
			this.state.defisCommune.push(data.defi);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		insertDefisEquipe(state,data) {
			this.state.defisEquipe.push(data.defi);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		insertDefi(state,data) {
			this.state.defis.push(data.defi);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		updateDefi(state,data) {
			var indexDefi = this.state.defis.findIndex(defi => {
					return (defi.nom == this.state.selectedDefi.nom) & (defi.categorie.nom == this.state.selectedCategorie.nom);
				});
			// mise a jour des informations
			this.state.defis[indexDefi].nom = data.defi.nom;
			this.state.defis[indexDefi].description_courte = data.defi.description_courte;
			this.state.defis[indexDefi].description_longue = data.defi.description_longue;
			this.state.defis[indexDefi].reglementation = data.defi.reglementation;
			this.state.defis[indexDefi].bareme = data.defi.bareme;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Liste des defis après update : "+JSON.stringify(this.state.defis));
		},
		
		resetAll (state) {
			ApplicationSettings.setString("store", "");
		},
		
		resetScoreEquipe(state) {
			console.log("TELESTORE : resetScoreEquipe ");
			this.state.scoresEquipe = [];
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		setDebug(state) {
			this.state.debug = !this.state.debug;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
    }
});

Vue.prototype.$store = store;

store.dispatch("init");
