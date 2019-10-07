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
			// vérification de la connectivité
			this.messages.push("Vérification de l'accès à  internet");
			const connectionType = connectivity.getConnectionType();
			if (connectionType !== connectivity.connectionType.none) {
					this.messages.push("Accès internet validé");
					this.reloadEquipes();
					this.reloadCategories();	
					this.reloadDefis();
					
					
					let message = this.$store.state.selectedEquipe ? this.$store.state.selectedEquipe.nom : "Pas d'équipe sélectionnée";
					
					console.log("équipe en cours : "+message);
					this.messages.push("équipe en cours : "+message);

				
				
				
			}
			else {
				this.messages.push("Pas de connexion internet !");
				this.$store.commit("load").then ( () => {
					this.messages.push("Chargement de l'équipe en cours sans réseau");
					let message = this.$store.state.selectedEquipe ? this.$store.state.selectedEquipe.nom : "Pas d'équipe sélectionnée";
					console.log("équipe en cours : "+message);
					this.messages.push("équipe en cours : "+message);
				});
				
			}
			this.chargement = false;
			console.log("équipe en cours root: "+JSON.stringify(this.$store.state.selectedEquipe));

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
				this.$navigateTo(accueil);
			},
			reloadCategories() {
				this.messages.push("Vérification des catégories");
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
				this.messages.push("Vérification des Défis");
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
				this.messages.push("Vérification des équipes");
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
				if (this.$store.state.equipes) {
					this.messages.push("Nombre d'équipe en base "+this.$store.state.equipes.length);
				};
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
