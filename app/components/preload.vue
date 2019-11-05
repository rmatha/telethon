<template>
	<Page class="page" actionBarHidden="true">
        <DockLayout stretchLastChild="true">
			<Header dock="top" />
			<StackLayout dock="bottom">
				<Image v-if="go" src="~/assets/icons/go.png" class="center mb50"  @tap="accueil" width="50%"   />
				<label v-else text="En attente des données serveur" class="sousTitre mb50" textWrap="true"  />
				<button v-if="$store.state.debug" text="ouvrir l'application" @tap="accueil"/>
				<Button v-if="$store.state.debug" text="reload equipes" @tap="reloadEquipes" />
				<Button v-if="$store.state.debug" text="reload catégories" @tap="reloadCategories" />
				<Button v-if="$store.state.debug" text="reload defis" @tap="reloadDefis" />
				<Button v-if="$store.state.debug" text="resetAll" @tap="resetAll" />
				<Button v-if="$store.state.debug" text="resetScoreEquipe" @tap="resetScoreEquipe" />
				<Button text="mode debug" @tap="setDebug" />
				
			</StackLayout>
			<StackLayout dock="center" class="preload" >
				<GridLayout rows="40" columns="*">
					<label class="center bold t24" text="Chargement de l'application" textWrap="true"/>
				</GridLayout>
				<ListView for="item in messages" class="preload">
				  <v-template>
					<GridLayout rows="25" columns="*">
						<label class="center" :text="item" textWrap="true"/>
					</GridLayout>
				  </v-template>
				</ListView>
			</StackLayout>
			
		</DockLayout>
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
				messages : [],
				connexion : false,
				go : false,
				equipesAll : [],
            };
        },
		mounted() {
			// initialisation du store avant quoi que ce soit
			this.$store.dispatch("init")
			.then( ()=> {
				// vérification de la connectivité
				
				this.messages.push("Récupération du store OK");
				const connectionType = connectivity.getConnectionType();
				if (connectionType !== connectivity.connectionType.none) {
						this.messages.push("Accès internet valide");
						// récupération de la liste des equipes existantes
						// TODO il faudra le déplacer dans le changeEquipe
						this.reloadEquipes();
						// chargement des categories
						this.reloadCategories();	
						this.reloadDefis();
						if (this.$store.state.selectedEquipe.commune) {
							this.messages.push("Récupération des defis de la commune");
							this.reloadDefisCommune();
						};
						// chargement des defis de la commune si elle est définie
						let message = this.$store.state.selectedEquipe ? this.$store.state.selectedEquipe.nom : "Pas d'équipe sélectionnée";
						
						// chargement de la version de l'équipe sur le serveur pour récupérer la dernière version si nécessaire
						/*if (this.$store.state.selectedEquipe) {
							this.messages.push("Recherche de la dernière version de l'équipe");
							this.reloadEquipeEnCours();
						};
						*/
						console.log("équipe en cours : "+message);
						this.messages.push("équipe en cours : "+message);
						
				}
				else {
					this.messages.push("Pas de connexion internet !");
					this.messages.push("Chargement de l'équipe en cours sans réseau");
					let message = this.$store.state.selectedEquipe ? this.$store.state.selectedEquipe.nom : "Pas d'équipe sélectionnée";
					console.log("équipe en cours : "+message);
					this.messages.push("équipe en cours : "+message);
					this.go = true;
					
					
				}
				this.chargement = false;
				console.log("équipe en cours root: "+JSON.stringify(this.$store.state.selectedEquipe));
			})
			.catch(() => {
				if (connectionType !== connectivity.connectionType.none) {
						this.messages.push("Accès internet validé");
						this.reloadEquipes();
						this.reloadCategories();	
						this.reloadDefis();
						this.reloadEquipeEnCours();
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
				console.log("isEquipeSelected : "+temp);
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
				.get('https://telethon.citeyen.com/public/api/categories/version')
				.then(response => {
					if (response.data.version > this.$store.state.versionCategorie) {
						// mise a jour de la table de categories
						this.messages.push("MAJ des catégories à partir du serveur");
						axios
						  .get('https://telethon.citeyen.com/public/api/categories/list')
						  .then(responseList => {
							this.$store.dispatch("reloadCategories",{"categories" : responseList.data,"version" : response.data.version});
						  });
					}else {
						this.messages.push("Catégories à jour");
					}
				})
			},
			reloadDefis() {
				// on commence par charger les defis dans le store pour voir s'ils n'ont pas été effacé
				console.log("Nombre de défis récupérés de la base : "+this.$store.state.defis.length);
				console.log("Version defi locale : "+this.$store.state.versionDefi);
				// révupération de la version des catégories sur le serveur 
				axios
				.get('https://telethon.citeyen.com/public/api/defis/version')
				.then(response => {
					var versionServeur = response.data.version
					console.log("Version defi serveur :"+versionServeur); 
					if ((response.data.version > this.$store.state.versionDefi) || (this.$store.state.defis.length == 0)) {
						// mise a jour de la table de categories
						console.log("MAJ des défis à partir du serveur");
						this.messages.push("MAJ des défis à partir du serveur :");
						axios
						  .get('https://telethon.citeyen.com/public/api/defis/list')
						  .then(responseList => {
							console.log("Chargement des  defis en base : "+JSON.stringify(responseList.data));
							this.$store.dispatch("reloadDefis",{"defis" : responseList.data,"version" : versionServeur});
						  });
					}else {
						this.messages.push("Defis à jour");
					}
				})
			},
			reloadEquipes() {
				console.log("Version equipe locale : "+this.$store.state.versionEquipe);
				// révupération de la version des catégories sur le serveur 
				axios
				.get('https://telethon.citeyen.com/public/api/equipes/version')
				.then(response => {
					console.log("Version equipe serveur :"+response.data.version); 
					if (response.data.version > this.$store.state.versionEquipe) {
						// mise a jour de la table de categories
						console.log("MAJ des equipes à partir du serveur");
						this.messages.push("MAJ des équipes à partir du serveur");
						axios
						  .get('https://telethon.citeyen.com/public/api/equipes/list')
						  .then(responseList => {
							console.log("Chargement des equipes en base : "+JSON.stringify(responseList.data));
							this.$store.dispatch("reloadEquipes",{equipes : responseList.data,version : response.data.version});
						  });
					}else {
						this.messages.push("Equipes  à jour ");
					}
					this.go = true;
				});
			},
			reloadDefisCommune() {
				console.log("Version defis commune locale : "+this.$store.state.versionDefisCommune);
				// révupération de la version des catégories sur le serveur 
				let params = {};
				params["commune"] = this.$store.state.selectedEquipe.commune;
				axios
				.get('https://telethon.citeyen.com/public/api/communes/version', {params : params})
				.then(response => {
					console.log("Version defis communes serveur :"+response.data.version); 
					if (response.data.version > this.$store.state.versionDefisCommune) {
						// mise a jour de la table de categories
						console.log("MAJ des defis communes à partir du serveur");
						this.messages.push("MAJ des defis commune à  partir du serveur");
						
						axios
							.get('https://telethon.citeyen.com/public/api/defisCommune/list', {params : params})
						  .then(responseList => {
							console.log("Chargement des defis de la commune en base : "+JSON.stringify(responseList.data));
							this.$store.dispatch("reloadDefisCommune",{"defis" : responseList.data,"version" : response.data.version});
						  });
					}else {
						this.messages.push("Defis pour la commune à jour ");
					}
					this.go = true;
				});
				
			},
			reloadEquipeEnCours() {
				let params = {};
				params["commune"] = this.$store.state.selectedEquipe.commune;
				params["nom"] = this.$store.state.selectedEquipe.nom;
				axios
				.get('https://telethon.citeyen.com/public/api/equipes/info', {params : params})
				.then(response => {
					// si la version du serveur plus récente, on récupère 
					console.log("version de l'équipe  en cours local : "+this.$store.state.selectedEquipe.version);
					console.log("version de l'équipe en cours  serveur  : "+JSON.stringify(response.data.version));
					//if (response.data.version > this.$store.state.selectedEquipe.version) {
					if (response.data) {
						console.log("Récupération serveur de l'équipe OK : ");
						this.messages.push("Récupération serveur de l'équipe OK");
						if (true) {
						//if (response.data.version > this.$store.state.selectedEquipe.version) {
							console.log("Mise a jour de la version de l'équipe a partir du serveur");
							this.messages.push("Mise a jour de la version de l'équipe a partir du serveur");
							this.$store.dispatch("setSelectedEquipe",{"equipe" : response.data});
						}
						else {
							console.log("Version de l'équipe déjà à jour");
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
</style>
