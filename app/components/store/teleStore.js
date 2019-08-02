import Vue from 'nativescript-vue';
import axios from 'axios'
	
const Vuex = require("vuex");

const Sqlite = require("nativescript-sqlite");

Vue.use(Vuex);
	

const store = new Vuex.Store({
    state: {
		connexion : null,
		debug : true,
        database: null,
        data: [],
		versionCategorie : "0",
		versionDefi : "0",
		versionEquipe : "0",
		updateCategorie : false,
		updateDefi : false,
		updateEquipe : false,
		selectedCommune : null,
		selectedCategorie : null,
		selectedDefi : null,
		selectedScore : null,
		selectedEquipe : {},
		isAdmin : true,
		isOrganisateur : true,
		participants: [],
		categories: [],
		defis: [],
		defisCommune: [],
		nosDefis: [],
		nosScores: [],
		equipes : [],
		scoresEquipe : []
    },
    mutations: {
		init(state, data) {
			state.database = data.database;
		},
		
		loadCategorieVersion(state, data) {
			console.log("loadCategorieVersion : -----"+data.data);
			state.versionCategorie = data.data ? data.data : 0;
		},
		loadDefiVersion(state, data) {
			console.log("loadCategorieDefi : -----"+data.data);
			state.versionDefi = data.data ? data.data : 0;
		},
		loadEquipeVersion(state, data) {
			console.log("loadCategorieEquipe : -----"+data.data);
			state.versionEquipe = data.data ? data.data : 0;
		},
		loadCurrentEquipe(state, data) {
			for(var i = 0; i < data.data.length; i++) {
				state.selectedEquipe.id = data.data[i][0];
				state.selectedEquipe.nom = data.data[i][1];
				state.selectedEquipe.commune = data.data[i][2];
				state.selectedEquipe.code = data.data[i][3];
				state.selectedEquipe.admin = data.data[i][4];
				state.selectedEquipe.organisateur = data.data[i][5];
			}
			console.log("mutation load currentEquipe: "+JSON.stringify(state.selectedEquipe));
		},
		
		loadEquipes(state, data) {
			console.log("loadEquipes");
			state.equipes = [];
			for(var i = 0; i < data.data.length; i++) {
				state.equipes.push({
					id : data.data[i][0],
					nom : data.data[i][1],
					commune : data.data[i][2],
					code : data.data[i][3],
					admin : data.data[i][4],
					organisateur : data.data[i][5],
				});
			}
			console.log("mutation load loadEquipes: "+JSON.stringify(state.equipes));
		},
		loadParticipants(state, data) {
			console.log("loadParticipants");
			state.participants = [];
			for(var i = 0; i < data.data.length; i++) {
				state.participants.push({
					id : data.data[i][0],
					firstname : data.data[i][1],
					lastname : data.data[i][2],
					telephone :	data.data[i][3],
					commune :	data.data[i][4],
				});
			}
			console.log("mutation load loadParticipants: "+JSON.stringify(state.participants));
		},
		loadCategorie(state, data) {
			state.categories = [];
			for(var i = 0; i < data.data.length; i++) {
				state.categories.push({
					id : data.data[i][0],
					nom : data.data[i][1]
				});
				console.log("mutation load categorie : "+JSON.stringify(state.categories));
			}
			
		},
		loadNosDefis(state, data) {
			console.log("loadNosDefis");
			state.nosDefis = [];
			
			for (var i = 0 ; i < this.state.defis.length; i++) {
				for (var j = 0 ; j < data.data.length ; j++) {
					console.log(i+" : "+ this.state.defis[i].id + " : "+j+" : "+data.data[j][1]);
					if (this.state.defis[i].id == data.data[j][1]) {
						state.nosDefis.push({
							id : this.state.defis[i].id,
							nom : this.state.defis[i].nom,
							description_courte: this.state.defis[i].description_courte , 
							description_longue : this.state.defis[i].description_longue,
							reglementation : this.state.defis[i].reglementation,
							bareme : this.state.defis[i].bareme,
							categorie : this.state.defis[i].categorie
						});
					}
				}
			};
			console.log("loadNosDefis : "+JSON.stringify(state.nosDefis));
			
		},
		loadDefisCurrentCommune(state, data) {
			state.defisCommune = [];
			
			for (var i = 0 ; i < this.state.defis.length; i++) {
				for (var j = 0 ; j < data.data.length ; j++) {
					console.log(i+" : "+ this.state.defis[i].id + " : "+j+" : "+data.data[j][1]);
					if (this.state.defis[i].id == data.data[j][1]) {
						state.defisCommune.push({
							id : this.state.defis[i].id,
							nom : this.state.defis[i].nom,
							description_courte: this.state.defis[i].description_courte , 
							description_longue : this.state.defis[i].description_longue,
							reglementation : this.state.defis[i].reglementation,
							bareme : this.state.defis[i].bareme,
							categorie : this.state.defis[i].categorie
						});
					}
				}
			};
			console.log("loadDefisCurrentCommune : "+JSON.stringify(state.defisCommune));
			
		},
		loadDefis(state, data) {
			state.defis = [];
			for(var i = 0; i < data.data.length; i++) {
				state.defis.push({
					id : data.data[i][0],
					nom : data.data[i][1],
					description_courte: data.data[i][2] , 
					description_longue : data.data[i][3],
					reglementation : data.data[i][4],
					bareme : data.data[i][5],
					categorie : data.data[i][6]
				});
				console.log("mutation load defis : "+JSON.stringify(state.defis));
			}
			
		},
		loadScoresEquipe(state, data) {
			console.log("loadScoresEquipe : ");
			state.scoresEquipe = [];
			for(var i = 0; i < data.data.length; i++) {
				state.scoresEquipe.push({
					id : data.data[i][0],
					idDefi : data.data[i][1],
					idParticipant : data.data[i][2] , 
					score : data.data[i][3],
					nomDefi : data.data[i][4],
					nomProfil : data.data[i][5]+" "+data.data[i][6],
				}); 
				console.log("mutation load scoresEquipe : "+JSON.stringify(state.scoresEquipe));
			}
			
		},
	},
    actions: {
		init(context) {
			(new Sqlite("my.db")).then(db => {
				db.execSQL("CREATE TABLE IF NOT EXISTS participant (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT, telephone TEXT,commune TEXT)").then(id => {
					context.commit("init", { database: db });
					console.log("Table participant cree ");
				}, error => {
					console.log("CREATE TABLE ERROR", error);
				});
				db.execSQL("CREATE TABLE IF NOT EXISTS configVersion (id INTEGER PRIMARY KEY AUTOINCREMENT, libelle type UNIQUE, valeur INTEGER)").then(id => {
					context.commit("init", { database: db });
					console.log("Table configVersion cree");
				}, error => {
					console.log("CREATE TABLE ERROR", error);
				});
				db.execSQL("CREATE TABLE IF NOT EXISTS defi (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, description_courte TEXT, description_longue TEXT,reglementation TEXT,bareme TEXT,categorie INTEGER)").then(id => {
					context.commit("init", { database: db });
					console.log("Table defi cree");
				}, error => {
					console.log("CREATE TABLE ERROR defi", error);
				});
				db.execSQL("CREATE TABLE IF NOT EXISTS categorie (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT)").then(id => {
					context.commit("init", { database: db });
					console.log("Table categorie cree");
				}, error => {
					console.log("CREATE TABLE ERROR categorie", error);
				});
				db.execSQL("CREATE TABLE IF NOT EXISTS equipe (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, commune TEXT, current tinyint(1), code varchar(256), admin tinyint(1), organisateur tinyint(1),UNIQUE(nom,commune))").then(id => {
					context.commit("init", { database: db });
					console.log("Table equipe cree");
				}, error => {
					console.log("CREATE TABLE ERROR equipe", error); 
				});
				db.execSQL("CREATE TABLE IF NOT EXISTS nosDefis (id INTEGER PRIMARY KEY AUTOINCREMENT, idDefi INTEGER, idEquipe INTEGER)").then(id => {
					context.commit("init", { database: db });
					console.log("Table nosDefis cree");
				}, error => { 
					console.log("CREATE TABLE ERROR nosDefis", error); 
				});
				db.execSQL("CREATE TABLE IF NOT EXISTS score (id INTEGER PRIMARY KEY AUTOINCREMENT, idDefi INTEGER, idParticipant INTEGER, score INTEGER)").then(id => {
					context.commit("init", { database: db });
					console.log("Table score cree");
				}, error => { 
					console.log("CREATE TABLE ERROR score", error); 
				});
				db.execSQL("CREATE TABLE IF NOT EXISTS defisCommune (id INTEGER PRIMARY KEY AUTOINCREMENT, idDefi INTEGER, commune varchar(256))").then(id => {
					context.commit("init", { database: db });
					console.log("Table defisCommune cree");
				}, error => { 
					console.log("CREATE TABLE ERROR defisCommune", error); 
				});
				
			}, error => {
				console.log("OPEN DB ERROR", error);
			});
		},
		insertParticipant(context, data) {
			console.log("id du participant : "+data.id+" : del'équipe : "+this.state.selectedEquipe.id);
			if (data.id < 0) {
				console.log("insert d'un nouveau participant");
				context.state.database.execSQL("INSERT INTO participant (firstname, lastname,telephone,commune) VALUES (?,?,?,?)", [data.firstname, data.lastname, data.telephone,data.commune]).then(id => {
					console.log("insertParticipant add participant");
					context.dispatch("queryParticipants");
				}, error => {
					console.log("insertParticipant INSERT ERROR", error);
				});
			}
			else {
				console.log("update d'un nouveau participant");
				context.state.database.execSQL("UPDATE participant set firstname = ?, lastname = ?,telephone =?, commune = ? where id = ?", [data.firstname, data.lastname, data.telephone,data.commune,data.id]).then(id => {
					context.dispatch("queryParticipants");
				}, error => {
					console.log("insertParticipant UPDATE ERROR", error);
				});
			}
		},
		insertCategorie(context, data) {
			if (data.id == 0) {
				context.state.database.execSQL("INSERT INTO categorie (nom) VALUES (?)", [data.nom]).then(id => {
					//context.commit("saveCategorie", { data: data });
				}, error => {
					console.log("INSERT ERROR categorie", error);
				});
			}
			else {
				context.state.database.execSQL("UPDATE categorie set nom = ? where id = ?", [data.nom,data.id]).then(id => {
					//context.commit("saveCategorie", { data: data });
				}, error => {
					console.log("update ERROR categorie", error);
				});
			}
		},
		insertCurrentEquipe(context, data) {
			console.log("insertCurrentEquipe reset current");
			// on annule l'équipe qui était sélectionnée 
			context.state.database.execSQL("UPDATE equipe set current = 0", []).then(id => {
				console("reset current equipe OK");
			}, error => {
				console.log("INSERT ERROR", error);
			});
			console.log("insertCurrentEquipe insert equipe");
			context.state.database.execSQL("INSERT INTO equipe (nom,commune,current,code,admin,organisateur) VALUES (?,?,1,?,?,?)", [data.nom,data.commune,data.code,data.admin,data.organisateur]).then(id => {
				//context.commit("saveCategorie", { data: data });
				context.dispatch("queryCurrentEquipe");
			}, error => {
				console.log("INSERT ERROR categorie", error);
			});
			
		},
		insertDefi(context, data) {
			if (data.id == 0) {
				console.log("insertDefi : insert");
				context.state.database.execSQL("INSERT INTO defi (nom,description_courte,description_longue,reglementation,bareme,categorie) VALUES (?,?,?,?,?,?)", [data.nom,data.description_courte,data.description_longue,data.reglementation,data.bareme,data.categorie]).then(id => {
					//context.commit("saveDefi", { data: data });
					//queryDefis(context, data : [id : data.categorie]);
					context.dispatch("queryDefisCat", data.categorie);
				}, error => {
					console.log("INSERT ERROR defi", error);
				});
			}
			else {
				console.log("insertDefi : update");
				context.state.database.execSQL("UPDATE defi set nom = ?, description_courte = ?, description_longue = ?, reglementation = ?, bareme = ? where id = ?", [data.nom,data.description_courte,data.description_longue,data.reglementation,data.bareme, data.id]).then(id => {
					//context.commit("saveDefi", { data: data });
					context.dispatch("queryDefisCat", data.categorie);
				}, error => {
					console.log("update ERROR defi", error);
				});
			}
		},
		insertNosDefis (context,data) {
			console.log("insertNosDefis defi : "+JSON.stringify(data));
			context.state.database.execSQL("INSERT INTO nosDefis (idDefi,idEquipe) VALUES (?,?)", [data.defi.id,this.state.selectedEquipe.id]).then(id => {
				context.dispatch("queryNosDefis");
			}, error => {
				console.log("INSERT ERROR defi", error);
			});
		
		},
		insertDefisCurrentCommune (context,data) {
			console.log("insertDefisCurrentCommune defi : "+JSON.stringify(data));
			context.state.database.execSQL("INSERT INTO defisCommune (idDefi,commune) VALUES (?,?)", [data.defi.id,this.state.selectedEquipe.commune]).then(id => {
				context.dispatch("queryDefisCurrentCommune");
			}, error => {
				console.log("INSERT ERROR defi", error);
			});
		
		},
		insertScore(context, data) {
			if (data.id) {
  				console.log("insertScore : update");
				context.state.database.execSQL("UPDATE score set idDefi = ?, idParticipant = ?, score = ? where id = ?", [data.idDefi,data.idParticipant,data.score,data.id]).then(id => {
					//context.commit("saveDefi", { data: data });
					context.dispatch("queryScoresEquipe");
				}, error => {
					console.log("update ERROR score", error);
				});
			}
			else {
				console.log("insertScore : insert");
				context.state.database.execSQL("INSERT INTO score (idDefi,idParticipant,score) VALUES (?,?,?)", [data.idDefi,data.idParticipant,data.score]).then(id => {
					context.dispatch("queryScoresEquipe");
				}, error => {
					console.log("INSERT ERROR score", error);
				});
			}
		},
		updateCurrentEquipe(context,data) {
			// on annule l'équipe qui était sélectionnée 
			context.state.database.execSQL("UPDATE equipe set current = 0", []).then(id => {
				console.log("updateCurrentEquipe : current = 0 OK");
				// on place la nouvelle equipe en current
				context.state.database.execSQL("UPDATE equipe set current = 1 where nom = ? and commune = ?", [data["nom"],data["commune"]]).then(id => {
					context.dispatch("queryCurrentEquipe");
					// maintenant il faut récupérer les particpants du serveur 
						
					
				}, error => {
					console.log("INSERT ERROR", error);
				});
			}, error => {
				console.log("updateCurrentEquipe : update 0 ERROR", error);
			});
			
			//console.log("action query : "+JSON.stringify(data));
		},
		downloadParticipants(context,data) {
			console.log("downloadParticipants : data :"+JSON.stringify(data));
			// on annule l'équipe qui était sélectionnée 
			context.state.database.execSQL("DELETE FROM participant").then(id => {
				//context.commit("saveProfil", { data: data });
				//context.dispatch("queryParticipants",data);
			}, error => {
				console.log("downloadParticipants :PARTICPANT DELETE ERROR", error);
			});
			if (data) {
				for(var i = 0; i < data.length; i++) {
					context.state.database.execSQL("INSERT INTO  participant (firstname,commune) VALUES (?,?)", [data[i].nom,data[i].commune]).then(id => {
						console.log("downloadParticipants : participant inséré :"+data[i].nom);
					}, error => {
						console.log("downloadParticipants :INSERT ERROR", error);
					});
				}
				context.dispatch("queryParticipants");
			}
		},
		queryCurrentEquipe(context) {
			console.log("queryCurrentEquipe");
			context.state.database.all("SELECT id,nom,commune,code, admin,organisateur FROM equipe where current = 1").then(result => {
				console.log("queryCurrentEquipe récupération : "+ JSON.stringify(result));
				context.commit("loadCurrentEquipe", { data: result });
				/*;*/
			}, error => {
				console.log("SELECT ERROR", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryDonnees(context,data) {
			console.log("queryDonnees : data :"+data);
			context.dispatch("queryDefis");
			context.dispatch("queryEquipes");
			context.dispatch("queryCurentEquipe");
			if (data) {
				console.log("queryDonnees : selectedEquipes");
				context.dispatch("queryNosDefis");
				context.dispatch("queryParticipants");
				context.dispatch("queryDefisCurrentCommune");
				context.dispatch("queryScoresEquipe")
			}
		},
		queryCategorieVersion(context) {
			context.state.database.all("SELECT valeur FROM configVersion where libelle = 'categorie'").then(result => {
				context.commit("loadCategorieVersion", { data: result[0]});
			}, error => {
				console.log("SELECT ERROR versionCategorie", error);
			});
		},
		queryDefiVersion(context) {
			context.state.database.all("SELECT valeur FROM configVersion where libelle = 'defi'").then(result => {
				context.commit("loadDefiVersion", { data: result[0]});
			}, error => {
				console.log("SELECT ERROR versionDefi", error);
			});
		},
		queryEquipeVersion(context) {
			context.state.database.all("SELECT valeur FROM configVersion where libelle = 'equipe'").then(result => {
				context.commit("loadEquipeVersion", { data: result[0]});
			}, error => {
				console.log("SELECT ERROR versionEquipe", error);
			});
		},
		queryEquipes(context) {
			console.log("queryEquipes");
			context.state.database.all("SELECT id,nom,commune,code, admin, organisateur, current FROM equipe ", []).then(result => {
				context.commit("loadEquipes", { data: result });
				console.log("Liste des équipes : "+JSON.stringify(result));
			}, error => {
				console.log("SELECT ERROR", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryParticipants(context) {
			console.log("queryParticipants : chargement des participants ");
			context.state.database.all("SELECT id,firstname, lastname, telephone, commune FROM participant").then(result => {
				console.log("Liste des participants : "+JSON.stringify(result));
				context.commit("loadParticipants", { data: result });
			}, error => {
				console.log("SELECT ERROR", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryScoresEquipe(context) {
			console.log("queryScoresEquipe : chargement des score pour equipe "+this.state.selectedEquipe.id);
			context.state.database.all("SELECT score.id,idDefi, idParticipant, score, defi.nom, firstname, lastname from score, participant, defi where score.idDefi = defi.id and score.idParticipant = particpant.id ").then(result => {
				console.log("Nombre de réponses : "+JSON.stringify(result));
				context.commit("loadScoresEquipe", { data: result });
			}, error => {
				console.log("SELECT ERROR", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryDefisCurrentCommune(context) {
			console.log("querydefisCurrentCommune : chargement des defis pour la commune "+this.state.selectedEquipe.commune);
			context.state.database.all("SELECT id, idDefi, commune from defisCommune where commune = ?",[this.state.selectedEquipe.commune]).then(result => {
				console.log("Nombre de réponses : "+JSON.stringify(result));
				context.commit("loadDefisCurrentCommune", { data: result });
			}, error => {
				console.log("SELECT ERROR", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryCategorie(context) {
			context.state.database.all("SELECT id, nom FROM categorie", []).then(result => {
				context.commit("loadCategorie", { data: result });
			}, error => {
				console.log("SELECT ERROR categorie", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryDefis(context) {
			console.log("queryDefis");
			context.state.database.all("SELECT * FROM defi", []).then(result => {
				context.commit("loadDefis", { data: result });
				console.log("queryDefis : NB : "+result.length);
			}, error => {
				console.log("SELECT ERROR defis", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryDefisCat(context,data) {
			console.log("queryDefisCat : ID cat : "+data.id);
			context.state.database.all("SELECT * FROM defi where categorie = ?", [data.id]).then(result => {
				context.commit("loadDefis", { data: result });
				console.log("queryDefis : NB : "+result.length);
			}, error => {
				console.log("SELECT ERROR defis CAT", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryNosDefis(context) {
			console.log("queryNosDefis ");
			context.state.database.all("SELECT * FROM nosDefis where idEquipe = ?", [this.state.selectedEquipe.id]).then(result => {
				context.commit("loadNosDefis", { data: result });
				console.log("queryNosDefis : NB : "+result.length);
			}, error => {
				console.log("SELECT ERROR defis NOS", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		deleteCategorie(context, data) {
			context.state.database.execSQL("DELETE FROM categorie where id = ?", [data.id]).then(id => {
				context.dispatch("queryCategorie");
				//context.commit("saveCategorie", { data: data });
			}, error => {
				console.log("DELETE ERROR categorie", error);
			});
		},
		reloadCategories(context, tab) {
			context.state.database.execSQL("DELETE FROM categorie").then(id => {
				console.log("Table Catégories vidée");
			}, error => {
				console.log("DELETE ERROR categorie", error);
			});
			for (var j = 0 ; j < tab.data.length ; j++) {
				console.log("reloadCategories : intégration de la catégorie : "+tab.data[j].nom);
				context.state.database.execSQL("INSERT INTO categorie (id,nom) VALUES (?,?)", [tab.data[j].id,tab.data[j].nom]).then(id => {
					
					
				}, error => {
					console.log("reloadCategories INSERT ERROR", error);
				});
			}
			console.log("reloadCategories :MAJ de la version des catégories : "+tab.version);
			context.state.database.execSQL("REPLACE INTO configVersion (libelle,valeur) VALUES ('categorie',?)",tab.version).then(id => {
				console.log("reloadCategories : Table configVersion MAJ");
			}, error => {
				console.log("reloadCategories :UPDATE configVersion ", error);
			});
			context.commit("loadCategorieVersion", { data: tab.version });
			context.dispatch("queryCategorie");
		},
		reloadDefis(context, tab) {
			context.state.database.execSQL("DELETE FROM defi").then(id => {
				console.log("Table defi vidée");
			}, error => {
				console.log("DELETE ERROR defi", error);
			});
			for (var j = 0 ; j < tab.data.length ; j++) {
				console.log("intégration du défis : "+tab.data[j].nom);
				context.state.database.execSQL("INSERT INTO defi (id,nom,description_courte,description_longue,reglementation,bareme,categorie) VALUES (?,?,?,?,?,?,?)", [tab.data[j].id,tab.data[j].nom,tab.data[j].description,tab.data[j].description_longue,tab.data[j].reglementation,tab.data[j].bareme,tab.data[j].categorie.id]).then(id => {
					//context.commit("saveProfil", { data: data });
					
				}, error => {
					console.log("defi INSERT ERROR", error);
				});
			}
			console.log("MAJ de la version des défis : "+tab.version);
			context.state.database.execSQL("REPLACE INTO configVersion (libelle,valeur) VALUES ('defi',?)",tab.version).then(id => {
				console.log("Table configVersion MAJ");
			}, error => {
				console.log("UPDATE configVersion ", error);
			});
			context.commit("loadDefiVersion", { data: tab.version });
			context.dispatch("queryDefis");
		},
		reloadEquipes(context, tab) {
			for (var j = 0 ; j < tab.data.length ; j++) {
				context.state.database.execSQL("REPLACE INTO equipe (nom,commune,code,admin,organisateur) VALUES (?,?,?,?,?)", [tab.data[j].nom,tab.data[j].commune,tab.data[j].code,tab.data[j].admin,tab.data[j].organisateur]).then(id => {
					console.log ("reloadEquipes : replace : "+tab.data["nom"]);
				}, error => {
					console.log("DELETE ERROR equipe", error);
				});
			}
			console.log("MAJ de la version des équipes : "+tab.version);
			context.state.database.execSQL("REPLACE INTO configVersion (libelle,valeur) VALUES ('equipe',?)",tab.version).then(id => {
				console.log("Table configVersion MAJ");
			}, error => {
				console.log("UPDATE configVersion ", error);
			});
			context.commit("loadEquipeVersion", { data: tab.version });
			context.dispatch("queryEquipes");
		},
		deleteDefi(context, data) {
			context.state.database.execSQL("DELETE FROM defi where id = ?", [data.id]).then(id => {
				//context.commit("savedefi", { data: data });
				context.dispatch("queryDefisCat", data.categorie);
				context.dispatch("queryDefis");
			}, error => {
				console.log("DELETE ERROR defi", error);
			});
		},
		deleteParticipant(context, data) {
			context.state.database.execSQL("DELETE FROM participant where id = ?", [data.id]).then(id => {
				context.dispatch("queryParticipants");
			}, error => {
				console.log("DELETE ERROR defi", error);
			});
		},
		deleteNosDefis(context, data) {
			context.state.database.execSQL("DELETE FROM nosDefis where idDefi = ? and idEquipe = ?", [data.defi.id, this.state.selectedEquipe.id]).then(id => {
				//context.commit("savedefi", { data: data });
				context.dispatch("queryNosDefis");
			}, error => {
				console.log("DELETE ERROR nosDefis", error);
			});
		},
		deleteDefisCurrentCommune(context, data) {
			context.state.database.execSQL("DELETE FROM defisCommune where idDefi = ? and commune = ?", [data.defi.id, this.state.selectedEquipe.commune]).then(id => {
				//context.commit("savedefi", { data: data });
				context.dispatch("queryDefisCurrentCommune");
			}, error => {
				console.log("DELETE ERROR nosDefis", error);
			});
		},
		deleteBase(context) {
			context.state.database.execSQL("DROP TABLE participant").then(id => {
				console.log("Suppression de la table challenge");
			}, error => {
				console.log("drop ERROR conf", error);
			});
			context.state.database.execSQL("DROP TABLE equipe").then(id => {
				console.log("Suppression de la table equipe");
			}, error => {
				console.log("DELETE ERROR score", error);
			});
			context.state.database.execSQL("DROP TABLE defi").then(id => {
				console.log("Suppression de toutes les tables");
			}, error => {
				console.log("DELETE ERROR conf", error);
			});
			context.state.database.execSQL("DROP TABLE configVersion").then(id => {
				console.log("Suppression de la table configVersion");
			}, error => {
				console.log("DELETE ERROR config", error);
			});
		},
		listEquipeBase(context) {
			context.state.database.all("SELECT id,nom,commune,code, admin,organisateur FROM equipe").then(result => {
				console.log("equipes :"+JSON.stringify(result));
			}, error => {
				console.log("SELECT EQUIPE error", error);
			});
			context.state.database.execSQL("SELECT id,firstname,lastname FROM participant").then(result => {
				console.log("participants :"+JSON.stringify(result));
			}, error => {
				console.log("SELECT EQUIPE error", error);
			});
		},
		
		
	}
});



Vue.prototype.$store = store;

store.dispatch("init");
