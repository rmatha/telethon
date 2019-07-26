<template>
	<Page class="page" actionBarHidden="true">
        <DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			
			<StackLayout  dock="center" class="root" >
				<label class="titre" text="Bonjour !"  horizontalAlignment="center"/>
				<Button v-if="$store.state.debug" text="Lister les equipes" @tap="showEquipe" />
				<Button v-if="$store.state.debug" text="effacer table" @tap="reinit" />
				<button v-if="$store.state.debug" text="init monitoring reseau" @tap="checkNetwork" />
				<Button v-if="$store.state.debug" text="Recharger l'équipe e cours" @tap="reinitEquipe" />
				<Button v-if="$store.state.debug" text="Rechargerr les scores" @tap="reinitScore" />
				
				
				<StackLayout  v-if="isEquipeSelected">
					<GridLayout rows="*,*,*" columns="*,auto">
						<StackLayout row="0" col="0">
							<label class="label" text="Equipe :"  />
							<label class="valeur" :text="nomEquipe"  />
							<label class="valeur" :text="nbParticipantsEquipe"  />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="0" @tap="navEquipe" stretch="none" />
						<StackLayout row="1" col="0">	
							<label class="label" text="Défis : "  />
							<label class="valeur" :text="nbDefisEquipe"  />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="1" @tap="navMesDefis" stretch="none" />
						<StackLayout row="2" col="0">	
							<label class="label" text="Score : "/>
							<label class="valeur" text="coming soon !!!"  /><Label :text="networkStatus" />
						</StackLayout>
						<Image  src="~/assets/icons/modify.png" col="1" row="2" @tap="navScore" stretch="none" class="modify"/>
						
					</GridLayout>
				</StackLayout>
				<StackLayout v-else>
					<Label class="labelEquipeSelect" text="Pour commencer vous devez définir votre équipe" textWrap="true" horizontalAlignment="center" />
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
	import mesDefis from "./defi/mesDefis";
	import resultats from "./score/resultats";
	import axios from 'axios'
	
    export default {
		data() {
            return {
				networkStatus : "",
				connexion : false,
				categories : []
            };
        },
		mounted() {
			console.log("home ");
			// chargement des données en fonction de l'équipe en cours
			var isEquipeSelected = this.$store.state.selectedEquipe.nom ? true : false;
			this.$store.dispatch("queryDonnees", isEquipeSelected);
			
		},
        computed: {
			nomEquipe() {
				return "Nom de l'équipe : "+this.$store.state.selectedEquipe.nom;
			},
			nbParticipantsEquipe() {
				return "Nombre de particpants : "+this.$store.state.profilsEquipe.length;
			},
			nbDefisEquipe() {
				var messageDefi = "Pas de défis enregistrés pour l'équipe... Utilisez le bouton à droite pour gérer vos défis !";
				if (this.$store.state.nosDefis.length > 0) {
					messageDefi ="Nombre de défis pour l'équipe : "+this.$store.state.nosDefis.length;
				}
				return messageDefi;
			},
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
			navChangeEquipe(type) {
				this.$navigateTo(changeEquipe, { props: {type : type}});
			},
			navMesDefis() {
				this.$navigateTo(mesDefis);
			},
			navScore() {
				this.$navigateTo(resultats);
			},
			navEquipe() {
				this.$navigateTo(equipe);
			},
			titreEquipe() {
				if (this.$store.state.selectedEquipe) {
					return this.$store.state.selectedEquipe.nom;
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
			},
			showEquipe() {
				console.log("On affiche les équipes en base !!");
				this.$store.dispatch("queryEquipes");
				console.log("On affiche équipe en cours !!");
				this.$store.dispatch("queryCurrentEquipe");
			}

		}
    };
</script>
<style>
.chargement {
	margin-top : 50%;
	text-align : center;
}

.labelEquipeSelect {
	font-size : 18px;
	margin : 10% 5%;
	text-align : center;
}

.actionLabel {
	margin : 0 10%;
}
</style>
