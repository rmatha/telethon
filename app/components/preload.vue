<template>
	<Page class="page" actionBarHidden="true">
        <ScrollView class="fullscreen">
			<GridLayout rows="*,100,50" columns="*">
				<Image row="0" col="0" rowSpan="3" src="~/assets/ResourcePage/background.png" />
				<Image row="1" col="0" v-if="go" src="~/assets/icons/go.png" class="center mb50"  @tap="accueil" width="50%"   />
				<label  v-else row="1" col="0" class="center bold t24 white" text="Chargement de l'application" textWrap="true"/>
				<StackLayout row="2" col="0" class="preload" >
					<GridLayout rows="40" columns="*">
						
					</GridLayout>
					<ListView for="item in messages" class="preload">
					  <v-template>
						<GridLayout rows="25" columns="*">
							<label class="center" :text="item" textWrap="true"/>
						</GridLayout>
					  </v-template>
					</ListView>
				</StackLayout>
			</GridLayout>	
			
			<label v-if="$store.state.debug" text="En attente des données serveur" class="sousTitre mb50" textWrap="true"  />
			<button v-if="$store.state.debug" text="ouvrir l'application" @tap="accueil"/>
			<Button v-if="$store.state.debug" text="reload equipes" @tap="reloadEquipes" />
			<Button v-if="$store.state.debug" text="reload catégories" @tap="reloadCategories" />
			<Button v-if="$store.state.debug" text="reload defis" @tap="reloadDefis" />
			<Button v-if="$store.state.debug" text="resetAll" @tap="resetAll" />
			<Button v-if="$store.state.debug" text="resetScoreEquipe" @tap="resetScoreEquipe" />
			<Button v-if="$store.state.debug" text="mode debug" @tap="setDebug" />
		</ScrollView>
    </Page>
</template>

<script>
	const connectivity = require("connectivity");
	import axios from 'axios';
	import accueil from './accueil';
	import * as ApplicationSettings from "application-settings";
	import villesRef from "@/assets/villes.json"

	
    export default {
		data() {
            return {
				networkStatus : "",
				messages : ["Version 1.5"],
				connexion : false,
				go : false,
				equipesAll : [],
            };
        },
		mounted() {
			// initialisation du store avant quoi que ce soit
			console.log("PRELOAD  : Lancement du init !");
			this.$store.dispatch("init")
			.then( ()=> {
				// vérification de la connectivité
				console.log("PRELOAD  : vérification de la connectivité");
				this.messages.push("Récupération du store OK");
				const connectionType = connectivity.getConnectionType();
				if (connectionType !== connectivity.connectionType.none) {
						this.messages.push("Accès internet valide");
						console.log("PRELOAD : Accès internet valide");
						// récupération de la liste des equipes existantes
						// TODO il faudra le déplacer dans le changeEquipe
						this.reloadEquipes();
						console.log("PRELOAD : Chargement des équipes OK");
						// chargement des categories
						this.reloadCategories();	
						console.log("PRELOAD : Chargement des catégories OK");
						this.reloadDefis();
						console.log("PRELOAD : Chargement des défis OK");
						if (this.$store.state.selectedEquipe) {
							this.messages.push("Récupération des defis de la commune");
							console.log("PRELOAD : Chargement des défis de la commune OK");
							this.reloadDefisCommune();
						};
						// chargement des defis de la commune si elle est définie
						console.log("PRELOAD : store en cours "+this.$store);
						let message = this.$store.state.selectedEquipe ? this.$store.state.selectedEquipe.nom : "Pas d'équipe sélectionnée";
						
						// chargement de la version de l'équipe sur le serveur pour récupérer la dernière version si nécessaire
						/*if (this.$store.state.selectedEquipe) {
							this.messages.push("Recherche de la dernière version de l'équipe");
							this.reloadEquipeEnCours();
						};
						*/
						//console.log("équipe en cours : "+message);
						this.messages.push("équipe en cours : "+message);
						console.log("PRELOAD : équipe en cours "+message);
						this.go = true;
						
				}
				else {
					this.messages.push("Pas de connexion internet !");
					this.messages.push("Chargement de l'équipe en cours sans réseau");
					let message = this.$store.state.selectedEquipe ? this.$store.state.selectedEquipe.nom : "Pas d'équipe sélectionnée";
					//console.log("équipe en cours : "+message);
					this.messages.push("équipe en cours : "+message);
					this.go = true;
					
					
				}
				this.chargement = false;
				//console.log("équipe en cours root: "+JSON.stringify(this.$store.state.selectedEquipe));
			})
			.catch(() => {
				if (connectionType !== connectivity.connectionType.none) {
						console.log("PRELOAD  : acces internet OK");
						this.messages.push("chargement des équipes");
						this.reloadEquipes();
						console.log("PRELOAD  : Chargement des équipes");
						this.reloadCategories();	
						console.log("PRELOAD  : Chargement des défis");
						this.reloadDefis();
						console.log("PRELOAD  : Chargement de l'équipe en cours");
						this.reloadEquipeEnCours();
						console.log("PRELOAD  : fin des chargements");
						this.go = true;
					
				}
				else {
					this.messages.push("Pas de connexion internet !");
					this.messages.push("Impossible de lancer l'application");
					this.go = false;
					
					
				}
				
			});
			
		},
        computed: {
			currentEquipe() {
				var reponse = this.$store.state.selectedEquipe ? this.$store.state.selectedEquipe.nom : "Pas d'équipe  sélectionnée";
				return reponse;
			},
			isEquipeSelected() {
				var temp = this.$store.state.selectedEquipe.nom ? true : false;
				//console.log("isEquipeSelected : "+temp);
				return temp;
			}
        },
        
		methods: {
			
			accueil() {
				this.$navigateTo(accueil, {
					transition: {
						name:'fade',
						duration: 800
					}
				});
			},
			reloadCategories() {
				//récuperation du numero de version locale pour les categories
				// révupération de la version des catégories sur le serveur 
				axios
				.get('https://telethon2020.citeyen.com/api/categorie/list')
				.then(response => {
					if ((response.data.version > this.$store.state.versionCategorie) || (this.$store.state.categories.length == 0)) {
						// mise a jour de la table de categories
						this.messages.push("MAJ des catégories à partir du serveur");
						this.$store.dispatch("reloadCategories",{"categories" : response.data.categories,"version" : response.data.version});
					}else {
						this.messages.push("Catégories à jour");
					}
				})
			},
			reloadDefis() {
				// on commence par charger les defis dans le store pour voir s'ils n'ont pas été effacé
				//console.log("Nombre de défis récupérés de la base : "+this.$store.state.defis.length);
				//console.log("Version defi locale : "+this.$store.state.versionDefi);
				// révupération de la version des catégories sur le serveur 
				axios
				.get('https://telethon2020.citeyen.com/api/defi/list')
				.then(response => {
					//console.log("Version defi serveur :"+versionServeur); 
					if ((response.data.version > this.$store.state.versionDefi) || (this.$store.state.defis.length == 0)) {
						// mise a jour de la table de categories
						console.log("MAJ des défis à partir du serveur");
						this.$store.dispatch("reloadDefis",{"defis" : response.data.defis,"version" : response.data.version});
					}else {
						this.messages.push("Defis à jour");
					}
				})
			},
			reloadEquipes() {
				//console.log("Version equipe locale : "+this.$store.state.versionEquipe);
				// révupération de la version des catégories sur le serveur 
				axios
				.get('https://telethon2020.citeyen.com/api/equipe/list')
				.then(response => {
					//console.log("Version equipe serveur :"+response.data.version); 
					if (response.data.version > this.$store.state.versionEquipe) {
						// mise a jour de la table de categories
						//console.log("MAJ des equipes à partir du serveur");
						this.messages.push("MAJ des équipes à partir du serveur");
						this.$store.dispatch("reloadEquipes",{"equipes" : response.data.equipes,"version" : response.data.version});
					}else {
						this.messages.push("Equipes  à jour ");
					}
					this.go = true;
				});
			},
			reloadDefisCommune() {
				//console.log("Version defis commune locale : "+this.$store.state.versionDefisCommune);
				// révupération de la version des catégories sur le serveur 
				let params = {};
				params["commune"] = this.$store.state.selectedEquipe.commune;
				axios
				.get('https://telethon2020.citeyen.com/api/commune/info', {params : params})
				.then(response => {
					//console.log("Version defis communes serveur :"+response.data.version); 
					this.messages.push("MAJ des defis commune à  partir du serveur");
					this.$store.dispatch("reloadDefisCommune",{"defis" : response.data.defis,"version" : response.data.version});
					this.go = true;
				});
				
			},
			reloadEquipeEnCours() {
				let params = {};
				params["commune"] = this.$store.state.selectedEquipe.commune;
				params["nom"] = this.$store.state.selectedEquipe.nom;
				axios
				.get('https://telethon2020.citeyen.com/api/equipe/info', {params : params})
				.then(response => {
					// si la version du serveur plus récente, on récupère 
					//console.log("version de l'équipe  en cours local : "+this.$store.state.selectedEquipe.version);
					//console.log("version de l'équipe en cours  serveur  : "+JSON.stringify(response.data.version));
					//if (response.data.version > this.$store.state.selectedEquipe.version) {
					if (response.data) {
						//console.log("Récupération serveur de l'équipe OK : ");
						this.messages.push("Récupération serveur de l'équipe OK");
						if (true) {
						//if (response.data.version > this.$store.state.selectedEquipe.version) {
							//console.log("Mise a jour de la version de l'équipe a partir du serveur");
							this.messages.push("Mise a jour de la version de l'équipe a partir du serveur");
							this.$store.dispatch("setSelectedEquipe",{"equipe" : response.data.equipe,"scores" : response.data.scores});
						}
						else {
							//console.log("Version de l'équipe déjà à jour");
							this.messages.push("Version de l'équipe déjà à jour");
						}
					};
				});
			},
			resetAll() {
				this.$store.dispatch("resetAll");
			},
			resetScoreEquipe() {
				this.$store.dispatch("resetScoreEquipe");
			},
			setDebug() {
				this.$store.dispatch("setDebug");
			},
		}
		
    };
</script>
<style>
.fullscreen {
    padding : 0;
	margin : 0;
}

.white {
	color : white;
}
</style>
