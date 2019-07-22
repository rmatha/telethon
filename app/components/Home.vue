<template>
	<Page class="page" actionBarHidden="true">
        <DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout v-if="chargement" dock="center" class="root" >
				<label :text="libelleChargement" class="valeur chargement"  />
				<button text="init monitoring reseau" @tap="checkNetwork" />
				<Button text="Réinitialiser les tables de la base" @tap="reinit" />
				<Button text="Recharger l'équipe e cours" @tap="reinitEquipe" />
				<Button text="Rechargerr les scores" @tap="reinitScore" />
				<Label :text="currentEquipe" />
				<Label text="Nombre de défis en base " />  
				<Label :text="$store.state.defis.length" />
			</StackLayout>
			<StackLayout v-else dock="center" class="root" >
				<label class="titre" text="Bonjour"  horizontalAlignment="center"/>
				<StackLayout v-if="$store.state.currentEquipe.nom">
					<GridLayout rows="*,*,*" columns="*,auto">
						<StackLayout row="0" col="0">
							<label class="label" text="Equipe :"  />
							<label class="valeur" :text="$store.state.currentEquipe.nom"  />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="0" @tap="navEquipe" stretch="none" />
						<StackLayout row="1" col="0">	
							<label class="label" text="Défis : "  />
							<label class="valeur" :text="$store.state.currentEquipe.defis"  verticalAlignment="bottom" horizontalAlignment="center"/>
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="1" @tap="navEquipe" stretch="none" />
						<StackLayout row="2" col="0">	
							<label class="label" text="Commune : "/>
							<label class="valeur" :text="$store.state.currentEquipe.commune"  /><Label :text="networkStatus" />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="2" @tap="navEquipe" stretch="none" class="modify"/>
						
					</GridLayout>
				</StackLayout>
				<StackLayout v-else>
					<Label class="labelEquipeSelect" text="! Pas d'équipe sélectionnée !" horizontalAlignment="center" />
					<GridLayout rows="100,100" columns="auto,auto" horizontalAlignment="center" >
						<Image  src="~/assets/icons/equipeAdd.png" col="0" row="0" @tap="navChangeEquipe('new')" />
						<Image  src="~/assets/icons/equipeSearch.png" col="1" row="0" @tap="navChangeEquipe('search')" />
						<Label class="actionLabel" text="Créer une équipe"  row="1" col="0" @tap="navChangeEquipe('new')"/>
						<Label class="actionLabel" text="Sélectionner une équipe"  row="1" col="1" @tap="navChangeEquipe('search')"  />
					</GridLayout>
				</StackLayout>
				
				
			</StackLayout>
			
		</DockLayout>
    </Page>
</template>

<script>
	const connectivity = require("connectivity");
	import changeEquipe from "./equipe/changeEquipe";
	import equipe from "./equipe/equipe";
	import axios from 'axios'
	
    export default {
		data() {
            return {
				networkStatus : "",
				chargement : true,
				libelleChargement : "test de la connexion internet",
				connexion : false,
				categories : []
            };
        },
		mounted() {
			console.log("home ");
			//this.$store.dispatch("queryCurrentEquipe");
			// vérification de la connectivité
			this.checkNetwork();
			
			console.log("connexion : "+this.connexion);
			if (this.connexion) {
				//récuperation du numero de version locale 
				this.$store.dispatch("queryCategorieVersion").then(() => {
					console.log("Version catégories locale :");
					console.log(JSON.stringify(this.$store.state.versionCategorie));
					console.log(typeof(this.$store.state.versionCategorie));
					// révupération de la version des catégories sur le serveur 
					console.log("on récupère la version des catégories sur le serveur");
					axios
					.get('https://telethon.citeyen.com/public/api/categories/version')
					.then(response => {
						console.log("axios :"+JSON.stringify(response.data.version));
						console.log("axios :"+typeof(response.data.version));
						if (response.data.version > this.$store.state.versionCategorie) {
							// mise a jour de la table de categories
							console.log("MAJ des catégories");
							axios
							  .get('https://telethon.citeyen.com/public/api/categories/list')
							  .then(responseList => {
								this.libelleChargement = JSON.stringify(responseList);
								console.log("nom de la premiere categories : " + responseList.data[0].nom);
								console.log("Nombre de categories : " + responseList.data.length);
								this.$store.dispatch("reloadCategories",{data : responseList.data,version : response.data.version});
							  });
						}else {
							console.log("Pas besoin de mettre à jour");
						}
					})
				});
			}
			console.log("équipe en cours : "+JSON.stringify(this.$store.state.currentEquipe));
		},
        computed: {
			currentEquipe() {
				return "Equipe en cours : "+this.$store.state.currentEquipe.nom;
			},
        },
        
		methods: {
			navChangeEquipe(type) {
				console.log("type : "+type);
				this.$navigateTo(changeEquipe, { props: {type : type}});
			},
			navEquipe() {
				this.$navigateTo(equipe);
			},
			titreEquipe() {
				if (this.$store.state.currentEquipe.nom.length > 0) {
					return this.$store.state.currentEquipe.nom;
				}
				return "Pas d'équipe en cours";
			},
			checkNetwork() {
				const connectionType = connectivity.getConnectionType();
				switch (connectionType) {
					case connectivity.connectionType.none:
						this.libelleChargement = "Pas de connexion internet disponible";
						this.connexion = false;
						break;
					case connectivity.connectionType.wifi:
						this.libelleChargement = "Connection WIFI valide";
						this.connexion = true;
						break;
					case connectivity.connectionType.mobile:
						this.libelleChargement = "Connection mobile valide";
						this.connexion = true;
						break;
				}
			},
			reinit() {
				this.$store.dispatch("deleteBase");
			},
			reinitEquipe() {
				console.log("En recharge l'équipe !!");
				this.$store.dispatch("queryCurrentEquipe");
			},
			reinitScore() {
				console.log("On recharge les scores !!");
				this.$store.dispatch("queryScoresEquipe");
			}

		}
    };
</script>
<style>
.chargement {
	margin-top : 50%;
	text-align : center;
}
</style>
