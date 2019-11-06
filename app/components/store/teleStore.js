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
				}
				resolve();
				
			});
        },
        
        setSelectedEquipe(context,data) {
			console.log("TELESTORE : setSelectedEquipe : data : "+JSON.stringify(data));
			this.state.selectedEquipe = data.equipe;
			this.state.updateEquipe;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : setSelectedEquipe : this.selectedEquipe :"+JSON.stringify(this.state.selectedEquipe));
			
		},
		
		
		resetVersion(state) {
			this.state.versionCategorie = 0;
			this.state.versionDefi = 0;
			this.state.versionEquipe = 0;
			console.log("telestore : resetConfig : "+JSON.stringify(this.state));
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
			console.log("TELESTORE : NEWEQUIPE : enregistrement de l'équipe");
			return new Promise((resolve) => {
				this.state.selectedEquipe = data.equipe;
				this.state.equipes.push(data.equipe);
				ApplicationSettings.setString("store", JSON.stringify(this.state));
				resolve();
			});
			
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
			console.log("TELESTORE : DELETEPARTICIPANT : Liste de particpants avant suppression : "+JSON.stringify(this.state.selectedEquipe.participants));
			var indexParticipant = this.state.selectedEquipe.participants.findIndex(item => {
					return item.nom == data.participant.nom;
				});
			console.log("TELESTORE : DELETEPARTICIPANT : index deleted : "+indexParticipant);
			this.state.selectedEquipe.participants[indexParticipant].delete = true;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : DELETEPARTICIPANT : Liste de particpants avant suppression : "+JSON.stringify(this.state.selectedEquipe.participants));
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
			if (!this.state.selectedEquipe.scores) {
				this.state.selectedEquipe.scores = [];
			}
			this.state.selectedEquipe.scores.push(data.score);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : insertScore : liste des scores : "+JSON.stringify(this.state.scoresEquipe)); 
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
			var indexScore = this.state.selectedEquipe.scores.findIndex(score => {
				return score == data.score;
			});
			console.log("TELESTORE : deleteScore : indexScore : "+indexScore);
			this.state.selectedEquipe.scores[indexScore].delete = true;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			
			console.log("TELESTORE : deleteScore : this.state.selectedEquipe.scores : "+JSON.stringify(this.state.selectedEquipe.scores));
		},
		
		recupereDefis(state) {
			console.log("TELESTORE : RECUPERERDEFIS : defisCommune : "+JSON.stringify(this.state.defiCommune.defis));
			console.log("TELESTORE : RECUPERERDEFIS : mesDefis : "+JSON.stringify(this.state.selectedEquipe.defis_equipes));
			//if (!this.state.selectedEquipe.defis_equipes) {
				this.state.selectedEquipe.defis_equipes = [];
			//}
			for (const defi of this.state.defiCommune.defis) {
				defi.delete = false;
				this.state.selectedEquipe.defis_equipes.push(defi);
			}
			console.log("TELESTORE : RECUPERERDEFIS : mesDefis : "+JSON.stringify(this.state.selectedEquipe.defis_equipes));
			
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		deleteDefi(state,data) {
			console.log("Liste des défis de la base avant suppression : "+JSON.stringify(this.state.defis));
			var indexDefi = this.state.defis.findIndex(defi => {
				return defi.defi.id == data.defi.id;
			});
			console.log("Index récupéré : "+indexDefi);
			this.state.selectedEquipe.defis_equipes[indexDefi].defi.delete = true;
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Liste des défis après suppression : "+JSON.stringify(this.state.selectedEquipe.defis_equipes));
		},
		
		deleteDefisCurrentCommune(state,data) {
			console.log("Nombre de défis commune avant suppression : "+this.state.defiCommune.length);
			this.state.defiCommune = this.state.defiCommune.filter(item => {
				return item !== data.defi;
			});
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("Nombre de défis commune après suppression : "+this.state.defiCommune.length);
		},
		
		reloadDefisCommune(state,data) {
			console.log("TELESTORE : RELOADDEFISCOMMUNE : Chargement des defis pour la commune "+this.state.selectedEquipe.commune);
			console.log("TELESTORE : RELOADDEFISCOMMUNE : Liste des defis à charger : "+JSON.stringify(data));
			console.log("TELESTORE : RELOADDEFISCOMMUNE : Liste des defis à charger .defis: "+JSON.stringify(data.defis));
			this.state.defiCommune = data;
			if (data.version) {
				this.state.versionDefisCommune = data.version;
			}
			console.log("TELESTORE : reloadDefisCommune : defis commune "+JSON.stringify(this.state.defiCommune));
			console.log("TELESTORE : reloadDefisCommune : defis commune "+JSON.stringify(this.state.defiCommune.defis));
			console.log("TELESTORE : reloadDefisCommune : defis commune length "+JSON.stringify(this.state.defiCommune.defis.length));
			
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			
			
		},
		deleteDefisEquipe(state,data) {
			console.log("TELESTORE : deleteDefisEquipe : Liste défis equipe avant suppression : "+JSON.stringify(this.state.selectedEquipe.defis_equipes));
			console.log("TELESTORE : deleteDefisEquipe : data avant suppression : "+JSON.stringify(data.defi));
			var indexDefiEquipe = this.state.selectedEquipe.defis_equipes.findIndex(item => {
				console.log("TELESTORE : deleteDefisEquipe : on compare : "+item.defi.id+" : "+data.defi.defi.id);
				return item.defi.id == data.defi.defi.id;
			});
			console.log("TELESTORE : deleteDefisEquipe : récupération de l'index :"+indexDefiEquipe);
			if (indexDefiEquipe >= 0) {
				this.state.selectedEquipe.defis_equipes[indexDefiEquipe].delete = true;
			};
			ApplicationSettings.setString("store", JSON.stringify(this.state));
			console.log("TELESTORE : deleteDefisEquipe : Liste defis equipe après suppression : "+JSON.stringify(this.state.selectedEquipe.defis_equipes));
		},
		
		insertDefisCurrentCommune(state,data) {
			if (!this.state.defisCommune) {
				this.state.defisCommune = [];
			}
			this.state.defisCommune.push(data.defi);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		insertDefisEquipe(state,data) {
			console.log("TELESTORE : insertDefisEquipe : before : "+JSON.stringify(this.state.selectedEquipe.defis_equipes));
			if (!this.state.selectedEquipe.defis_equipes) {
				this.state.selectedEquipe.defis_equipes = [];
			}
			data.defi.delete = false;
			this.state.selectedEquipe.defis_equipes.push(data.defi);
			console.log("TELESTORE : insertDefisEquipe : after : "+JSON.stringify(this.state.selectedEquipe.defis_equipes));
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		insertDefi(state,data) {
			this.state.defis.push(data.defi);
			ApplicationSettings.setString("store", JSON.stringify(this.state));
		},
		
		updateDefi(state,data) {
			console.log("TELESTORE: UPDATEDEFI : "+JSON.stringify(data.defi));
			console.log("TELESTORE: UPDATEDEFI : "+JSON.stringify(this.state.selectedDefi));
			var indexDefi = this.state.defis.findIndex(defi => {
					return defi.id == this.state.selectedDefi.defi.id;
				});
			console.log("TELESTORE: UPDATEDEFI : INDEX : "+indexDefi);
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
