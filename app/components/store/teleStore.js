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
		versionDefisCommune : "0",
		updateCategorie : false,
		updateDefi : false,
		updateEquipe : false,
		selectedParticipant : null,
		selectedCommune : null,
		selectedCategorie : null,
		selectedDefi : null,
		selectedScore : null,
		selectedEquipe : null,
		isAdmin : true,
		isOrganisateur : true,
		categories: [],
		defis: [],
		defisCommune: [],
		defis_equipes: [],
		equipes : [],
		scores : [],
		villes : []
    },
	actions : {
		init(state) {
			return new Promise((resolve, reject) => {
				console.log("TELESTORE : INIT : state : "+JSON.stringify(this.state));
				if(ApplicationSettings.getString("store")) {
					this.replaceState(
						Object.assign(this.state, JSON.parse(ApplicationSettings.getString("store")))
					);
					console.log("chargement du store terminé : "+JSON.stringify(this.state)); 
					resolve()
				}
				else {
					console.log("Pas de store dans les settigns");
					reject();
				
				};
			});
        },
        
        setSelectedEquipe(context,data) {
			console.log("TELESTORE : setSelectedEquipe : data : "+JSON.stringify(data));
			this.state.selectedEquipe = data.equipe;
			this.state.updateEquipe;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : setSelectedEquipe : this.selectedEquipe : "+JSON.stringify(this.state.selectedEquipe));
			
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
			console.log("TELESTORE : setVersionEquipe : Version de l'équipe : "+this.state.selectedEquipe.version); 
		
		},
		
		newEquipe(state,data) {
			this.state.selectedEquipe = data.equipe;
			this.state.equipes.push(data.equipe);
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
			if (!this.state.selectedEquipe.participants) {
				this.state.selectedEquipe.participants = [];
			}
			this.state.selectedEquipe.participants.push(data.participant);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		deleteParticipant(state,data) {
			console.log("Nombre de particpants avant suppression : "+JSON.stringify(this.state.selectedEquipe.participants));
			this.state.selectedEquipe.participants = this.state.selectedEquipe.participants.filter(item => {
					return item.nom !== data.participant.nom;
				});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de particpants après suppression : "+JSON.stringify(this.state.selectedEquipe.participants));
		},
		
		setParticipants(state,data) {
		    console.log("TELESTORE : setParticipants : Liste des particpants : "+JSON.stringify(data));
			this.state.selectedEquipe.participants = data.participants;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : setParticipants : Nombre de participants en base : "+this.state.selectedEquipe.participants.length); 
		},
	
		updateParticipant(state,data) {
			var indexParticipant = this.state.selectedEquipe.participants.findIndex(item => {
					return item == this.state.selectedParticipant;
				});
			// mise a jour des informations
			this.state.selectedEquipe.participants[indexParticipant].nom = data.participant.nom;
			this.state.selectedEquipe.participants[indexParticipant].commune = data.participant.commune;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de particpants après suppression : "+JSON.stringify(this.state.selectedEquipe.participants));
		},
		
		setSelectedParticipant(state,data) {
			this.state.selectedParticipant = data.participant;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		insertScore(state,data) {
			console.log("TELESTORE : insertScore : score en cours : "+JSON.stringify(data));
			this.state.selectedEquipe.scores.push(data.score);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : insertScore : liste des scores : "+this.state.scoresEquipe.length); 
		},
		
		updateScore(state,data) {
			var indexScore = this.state.selectedEquipe.scores.findIndex(item => {
					return item == this.state.selectedScore;
				});
			// mise a jour des informations
			this.state.selectedEquipe.scores[indexScore] = data.score;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : updateScore : Liste des scores après suppression : "+JSON.stringify(this.state.selectedEquipe.scores));
		},
		deleteScore(state,data) {
			this.state.selectedEquipe.scores = this.state.selectedEquipe.scores.filter(score => {
				return score !== data.score;
			});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		recupereDefis(state) {
			this.state.selectedEquipe.defis_equipes = this.state.defisCommune;
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
		
		reloadDefisCommune(state,data) {
			console.log("TELESTORE : RELOADDEFISCOMMUNE : Chargement des defis pour la commune "+this.state.selectedEquipe.commune);
			this.state.defisCommune = [];
			console.log("TELESTORE : RELOADDEFISCOMMUNE : Liste des defis à charger : "+JSON.stringify(data.defis));
			data.defis.forEach (idDefi => {
				console.log("TELESTORE : RELOADDEFISCOMMUNE : traitement du defis : "+idDefi.id);
				this.state.defisCommune.push(this.state.defis.filter( defi => {
					return defi.id == idDefi.id;
				})[0]);
				
			});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			
			
		},
		deleteDefisEquipe(state,data) {
			console.log("Nombre de défis equipe avant suppression : "+this.state.selectedEquipe.defis_equipes.length);
			this.state.selectedEquipe.defis_equipes = this.state.selectedEquipe.defis_equipes.filter(item => {
				return item !== data.defi;
			});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de défis equipe après suppression : "+this.state.selectedEquipe.defis_equipes.length);
		},
		
		insertDefisCurrentCommune(state,data) {
			this.state.defisCommune.push(data.defi);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		insertDefisEquipe(state,data) {
			this.state.selectedEquipe.defis_equipes.push(data.defi);
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
			this.state.selectedEquipe.scores = [];
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
