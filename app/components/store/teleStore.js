import Vue from 'nativescript-vue';
const Vuex = require("vuex");

const Sqlite = require("nativescript-sqlite");

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        database: null,
        data: [],
		profilsEquipe: 
		[{
			firstname : "",
			lastname : "",
			telephone : "",
			commune :"",
			equipe : -1,
		}],
		categories: [{
			id : Number,
			nom: ""
		}],
		defis: [{
			id : Number,
			nom : "",
			description_courte: "" , 
			description_longue : "",
			reglementation : "",
			bareme : "",
			categorie : -1
		}],
		defisCommune: [],
		nosDefis: [],
		currentEquipe : {
			id : -1,
			nom : "",
			commune : "",
			code : "",
			admin : 0,
		},
		equipes : [{
			id : -1,
			nom: "",
			commune : "",
			code : "",
			admin : 0,
		}],
		scoresEquipe : []
    },
    mutations: {
		init(state, data) {
			state.database = data.database;
		},
		loadCurrentEquipe(state, data) {
			console.log("loadCurrentEquipe");
			for(var i = 0; i < data.data.length; i++) {
				state.currentEquipe.id = data.data[i][0];
				state.currentEquipe.nom = data.data[i][1];
				state.currentEquipe.commune = data.data[i][2];
				state.currentEquipe.code = data.data[i][3];
				state.currentEquipe.admin = data.data[i][4];
			}
			console.log("mutation load currentEquipe: "+JSON.stringify(state.currentEquipe));
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
				});
			}
			console.log("mutation load loadEquipes: "+JSON.stringify(state.equipes));
		},
		loadProfilsEquipe(state, data) {
			console.log("loadProfilsEquipe");
			state.profilsEquipe = [];
			for(var i = 0; i < data.data.length; i++) {
				state.profilsEquipe.push({
					id : data.data[i][0],
					firstname : data.data[i][1],
					lastname : data.data[i][2],
					telephone :	data.data[i][3],
					equipe : data.data[i][4],
					commune :	data.data[i][5],
				});
			}
			console.log("mutation load loadProfilsEquipe: "+JSON.stringify(state.profilsEquipe));
		},
		loadCategorie(state, data) {
			state.categories = [];
			for(var i = 0; i < data.data.length; i++) {
				state.categories.push({
					id : data.data[i][0],
					nom : data.data[i][1]
				});
				console.log("mutation load categorie : "+JSON.stringify(state.categorie));
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
					idProfil : data.data[i][2] , 
					score : data.data[i][3]
				}); 
				console.log("mutation load scoresEquipe : "+JSON.stringify(state.scoresEquipe));
			}
			
		},
	},
    actions: {
		init(context) {
			(new Sqlite("my.db")).then(db => {
				db.execSQL("CREATE TABLE IF NOT EXISTS profil (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT, telephone TEXT,commune TEXT, equipe INTEGER)").then(id => {
					context.commit("init", { database: db });
					console.log("Table person cree");
				}, error => {
					console.log("CREATE TABLE ERROR", error);
				});
				db.execSQL("CREATE TABLE IF NOT EXISTS challenge (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, description_courte TEXT, description_longue TEXT,reglementation TEXT,bareme TEXT,categorie INTEGER)").then(id => {
					context.commit("init", { database: db });
					console.log("Table challenge cree");
				}, error => {
					console.log("CREATE TABLE ERROR challenge", error);
				});
				db.execSQL("CREATE TABLE IF NOT EXISTS categorie (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT)").then(id => {
					context.commit("init", { database: db });
					console.log("Table categorie cree");
				}, error => {
					console.log("CREATE TABLE ERROR categorie", error);
				});
				db.execSQL("CREATE TABLE IF NOT EXISTS equipe (id INTEGER PRIMARY KEY AUTOINCREMENT, nom varchar(256), commune varchar(256), current tinyint(1), code varchar(256), admin INTEGER)").then(id => {
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
				db.execSQL("CREATE TABLE IF NOT EXISTS score (id INTEGER PRIMARY KEY AUTOINCREMENT, idDefi INTEGER, idProfil INTEGER, score INTEGER)").then(id => {
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
		insertProfil(context, data) {
			console.log("id du participant : "+data.id+" : del'équipe : "+this.state.currentEquipe.id);
			if (data.id < 0) {
				console.log("insert d'un nouveau profil");
				context.state.database.execSQL("INSERT INTO profil (firstname, lastname,telephone,equipe,commune) VALUES (?,?,?,?,?)", [data.firstname, data.lastname, data.telephone,this.state.currentEquipe.id,data.commune]).then(id => {
					//context.commit("saveProfil", { data: data });
					context.dispatch("queryProfilsEquipe",data);
				}, error => {
					console.log("PROFIL INSERT ERROR", error);
				});
			}
			else {
				console.log("update d'un nouveau profil");
				context.state.database.execSQL("UPDATE profil set firstname = ?, lastname = ?,telephone =?, equipe = ?, commune = ? where id = ?", [data.firstname, data.lastname, data.telephone,this.state.currentEquipe.id,data.commune,data.id]).then(id => {
					//context.commit("saveProfil", { data: data });
					context.dispatch("queryProfilsEquipe",data);
				}, error => {
					console.log("INSERT ERROR", error);
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
			console.log("updateCurrentEquipe");
			// on annule l'équipe qui était sélectionnée 
			context.state.database.execSQL("UPDATE equipe set current = 0", []).then(id => {
				//context.commit("saveProfil", { data: data });
				//context.dispatch("queryProfilsEquipe",data);
			}, error => {
				console.log("INSERT ERROR", error);
			});
			context.state.database.execSQL("INSERT INTO equipe (nom,commune,current,code,admin) VALUES (?,?,1,?,?)", [data.nom,data.commune,data.code,data.admin]).then(id => {
				//context.commit("saveCategorie", { data: data });
				context.dispatch("queryCurrentEquipe", data);
			}, error => {
				console.log("INSERT ERROR categorie", error);
			});
			
		},
		insertDefi(context, data) {
			if (data.id == 0) {
				console.log("insertDefi : insert");
				context.state.database.execSQL("INSERT INTO challenge (nom,description_courte,description_longue,reglementation,bareme,categorie) VALUES (?,?,?,?,?,?)", [data.nom,data.description_courte,data.description_longue,data.reglementation,data.bareme,data.categorie]).then(id => {
					//context.commit("saveDefi", { data: data });
					//queryDefis(context, data : [id : data.categorie]);
					context.dispatch("queryDefisCat", data.categorie);
				}, error => {
					console.log("INSERT ERROR defi", error);
				});
			}
			else {
				console.log("insertDefi : update");
				context.state.database.execSQL("UPDATE challenge set nom = ?, description_courte = ?, description_longue = ?, reglementation = ?, bareme = ? where id = ?", [data.nom,data.description_courte,data.description_longue,data.reglementation,data.bareme, data.id]).then(id => {
					//context.commit("saveDefi", { data: data });
					context.dispatch("queryDefisCat", data.categorie);
				}, error => {
					console.log("update ERROR defi", error);
				});
			}
		},
		insertNosDefis (context,data) {
			console.log("insertNosDefis defi : "+JSON.stringify(data));
			context.state.database.execSQL("INSERT INTO nosDefis (idDefi,idEquipe) VALUES (?,?)", [data.defi.id,this.state.currentEquipe.id]).then(id => {
				//context.commit("saveDefi", { data: data });
				//queryDefis(context, data : [id : data.categorie]);
				context.dispatch("queryNosDefis", data.categorie);
			}, error => {
				console.log("INSERT ERROR defi", error);
			});
		
		},
		insertDefisCurrentCommune (context,data) {
			console.log("insertDefisCurrentCommune defi : "+JSON.stringify(data));
			context.state.database.execSQL("INSERT INTO defisCommune (idDefi,commune) VALUES (?,?)", [data.defi.id,this.state.currentEquipe.commune]).then(id => {
				//context.commit("saveDefi", { data: data });
				//queryDefis(context, data : [id : data.categorie]);
				context.dispatch("queryDefisCurrentCommune", data.categorie);
			}, error => {
				console.log("INSERT ERROR defi", error);
			});
		
		},
		insertScore(context, data) {
			if (data.id < 0) {
				console.log("insertScore : insert");
				context.state.database.execSQL("INSERT INTO score (idDefi,idProfil,score) VALUES (?,?,?)", [data.idDefi,data.idProfil,data.score]).then(id => {
					//context.commit("saveDefi", { data: data });
					//queryDefis(context, data : [id : data.categorie]);
					context.dispatch("queryScoresEquipe", data.categorie);
				}, error => {
					console.log("INSERT ERROR score", error);
				});
			}
			else {
				console.log("insertScore : update");
				context.state.database.execSQL("UPDATE score set idDefi = ?, idProfil = ?, score = ? where id = ?", [data.idDefi,data.idProfil,data.score,data.id]).then(id => {
					//context.commit("saveDefi", { data: data });
					context.dispatch("queryScoresEquipe", data.categorie);
				}, error => {
					console.log("update ERROR score", error);
				});
			}
		},
		updateCurrentEquipe(context,data) {
			console.log("updateCurrentEquipe");
			// on annule l'équipe qui était sélectionnée 
			context.state.database.execSQL("UPDATE equipe set current = 0", []).then(id => {
				//context.commit("saveProfil", { data: data });
				//context.dispatch("queryProfilsEquipe",data);
			}, error => {
				console.log("INSERT ERROR", error);
			});
			// on place la nouvelle equipe en current
			context.state.database.execSQL("UPDATE equipe set current = 1 where nom = ? and commune = ?", [data.nom,data.commune]).then(id => {
				//context.commit("saveProfil", { data: data });
				context.dispatch("queryCurrentEquipe",data);
			}, error => {
				console.log("INSERT ERROR", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryCurrentEquipe(context) {
			console.log("queryCurrentEquipe");
			context.state.database.all("SELECT id,nom,commune,code, admin FROM equipe where current = 1", []).then(result => {
				context.commit("loadCurrentEquipe", { data: result });
				context.dispatch("queryProfilsEquipe",this.state.currentEquipe);
				context.dispatch("queryDefis",this.state.currentEquipe);
				context.dispatch("queryEquipes",this.state.currentEquipe);
				context.dispatch("queryNosDefis",this.state.currentEquipe);
				context.dispatch("queryDefisCurrentCommune",this.state.currentEquipe);
				context.dispatch("queryScoresEquipe",this.state.currentEquipe);
			}, error => {
				console.log("SELECT ERROR", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryEquipes(context) {
			console.log("queryEquipes");
			context.state.database.all("SELECT id,nom,commune,code, admin FROM equipe ", []).then(result => {
				context.commit("loadEquipes", { data: result });
			}, error => {
				console.log("SELECT ERROR", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryProfilsEquipe(context,data) {
			console.log("queryProfilsEquipe : chargement des profils pour equipe "+this.state.currentEquipe.id);
			context.state.database.all("SELECT id,firstname, lastname, telephone, equipe, commune FROM profil where equipe = ?", [this.state.currentEquipe.id]).then(result => {
				context.commit("loadProfilsEquipe", { data: result });
			}, error => {
				console.log("SELECT ERROR", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryScoresEquipe(context,data) {
			console.log("queryScoresEquipe : chargement des score pour equipe "+this.state.currentEquipe.id);
			context.state.database.all("SELECT * from score, profil where score.idProfil = profil.id and profil.equipe = ?",[this.state.currentEquipe.id]).then(result => {
				console.log("Nombre de réponses : "+JSON.stringify(result));
				context.commit("loadScoresEquipe", { data: result });
			}, error => {
				console.log("SELECT ERROR", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryDefisCurrentCommune(context,data) {
			console.log("querydefisCurrentCommune : chargement des defis pour la commune "+this.state.currentEquipe.commune);
			context.state.database.all("SELECT id, idDefi, commune from defisCommune where commune = ?",[this.state.currentEquipe.commune]).then(result => {
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
		queryDefis(context,data) {
			console.log("queryDefis");
			context.state.database.all("SELECT * FROM challenge", []).then(result => {
				context.commit("loadDefis", { data: result });
				console.log("queryDefis : NB : "+result.length);
			}, error => {
				console.log("SELECT ERROR defis", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryDefisCat(context,data) {
			console.log("queryDefisCat : ID cat : "+data.id);
			context.state.database.all("SELECT * FROM challenge where categorie = ?", [data.id]).then(result => {
				context.commit("loadDefis", { data: result });
				console.log("queryDefis : NB : "+result.length);
			}, error => {
				console.log("SELECT ERROR defis CAT", error);
			});
			//console.log("action query : "+JSON.stringify(data));
		},
		queryNosDefis(context) {
			console.log("queryNosDefis ");
			context.state.database.all("SELECT * FROM nosDefis where idEquipe = ?", [this.state.currentEquipe.id]).then(result => {
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
		deleteDefi(context, data) {
			context.state.database.execSQL("DELETE FROM challenge where id = ?", [data.id]).then(id => {
				//context.commit("saveChallenge", { data: data });
				context.dispatch("queryDefisCat", data.categorie);
				context.dispatch("queryDefis", data.categorie);
			}, error => {
				console.log("DELETE ERROR challenge", error);
			});
		},
		deleteProfil(context, data) {
			context.state.database.execSQL("DELETE FROM profil where id = ?", [data.id]).then(id => {
				//context.commit("saveChallenge", { data: data });
				context.dispatch("queryProfilsEquipe");
			}, error => {
				console.log("DELETE ERROR challenge", error);
			});
		},
		deleteNosDefis(context, data) {
			context.state.database.execSQL("DELETE FROM nosDefis where idDefi = ? and idEquipe = ?", [data.defi.id, this.state.currentEquipe.id]).then(id => {
				//context.commit("saveChallenge", { data: data });
				context.dispatch("queryNosDefis");
			}, error => {
				console.log("DELETE ERROR nosDefis", error);
			});
		},
		deleteDefisCurrentCommune(context, data) {
			context.state.database.execSQL("DELETE FROM defisCommune where idDefi = ? and commune = ?", [data.defi.id, this.state.currentEquipe.commune]).then(id => {
				//context.commit("saveChallenge", { data: data });
				context.dispatch("queryDefisCurrentCommune");
			}, error => {
				console.log("DELETE ERROR nosDefis", error);
			});
		},
		deleteBase(context) {
			context.state.database.execSQL("DROP TABLE equipe").then(id => {
				console.log("Suppression de la table equipe");
			}, error => {
				console.log("DELETE ERROR challenge", error);
			});
			context.state.database.execSQL("DROP TABLE profil").then(id => {
				console.log("Suppression de la table profil");
			}, error => {
				console.log("DELETE ERROR score", error);
			});
		},
	}
});



Vue.prototype.$store = store;

store.dispatch("init");
