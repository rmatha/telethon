<template>
	<Page class="page" actionBarHidden="true">
        <DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<label class="TitreHome" text="Bonjour"  horizontalAlignment="center"/>
				<StackLayout v-if="$store.state.currentEquipe.nom">
					<label class="label" text="Equipe :"  horizontalAlignment="center"/>
					<label class="valeur" :text="$store.state.currentEquipe.nom"  />
					<label class="label" text="Défis : "   verticalAlignment="center" horizontalAlignment="center"/>
					<label class="valeur" :text="$store.state.currentEquipe.defis"  verticalAlignment="bottom" horizontalAlignment="center"/>
					<label class="label" text="Commune : "  verticalAlignment="center" horizontalAlignment="center"/>
					<label class="valeur" :text="$store.state.currentEquipe.commune"  /><Label :text="networkStatus" />
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
				<!--<button text="init monitoring reseau" @tap="checkNetwork" />
				<Button text="Réinitialiser les tables de la base" @tap="reinit" />
				<Button text="Recharger l'équipe e cours" @tap="reinitEquipe" />
				<Button text="Rechargerr les scores" @tap="reinitScore" />
				<Label :text="currentEquipe" />
				<Label text="Nombre de défis en base " />  
				<Label :text="$store.state.defis.length" />-->
				
			</StackLayout>
			
		</DockLayout>
    </Page>
</template>

<script>
	const connectivity = require("connectivity");
	import changeEquipe from "./equipe/changeEquipe";
    export default {
		data() {
            return {
				networkStatus : "",
            };
        },
		mounted() {

			console.log("home ");
			this.$store.dispatch("queryCurrentEquipe");
			// vérification de la connectivité
			/*this.networkStatus = "Monitoring network connection changes.";
            connectivity.startMonitoring((newConnectionType) => {
                switch (newConnectionType) {
                case connectivity.connectionType.none:
                    this.networkStatus = "No network connection available!";
                    break;
                case connectivity.connectionType.wifi:
					this.networkStatus = "You are now on wifi!";
                    break;
                case connectivity.connectionType.mobile:
					this.networkStatus = "You are now on a mobile data network!";
                    break;
                
				});*/
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
						alert("No network connection available!");
						break;
					case connectivity.connectionType.wifi:
						alert("You are on wifi!");
						break;
					case connectivity.connectionType.mobile:
						alert("You are on a mobile data network!");
						break;
				}
			},
			monitorNetworkStart() {
				
				console.log("chargment du status");
				this.networkStatus = "Monitoring network connection changes.";
				connectivity.startMonitoring((newConnectionType) => {
					switch (newConnectionType) {
					case connectivity.connectionType.none:
						this.networkStatus = "No network connection available!";
						break;
					case connectivity.connectionType.wifi:
						this.networkStatus = "You are now on wifi!";
						break;
					case connectivity.connectionType.mobile:
						this.networkStatus = "You are now on a mobile data network!";
						break;
					}
				});
			},
			monitorNetworkStop() {
				connectivity.stopMonitoring();
				this.networkStatus =
					"No longer monitoring network connection changes.";
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
.page {
	background-color : #fbc62d;
}
.TitreHome {
	font-size : 40px;;
	
}
.actionLabel {
	margin : 0 20px;
	color : white;
	font-weight: bold;
}
.labelEquipeSelect {
	margin : 80px 0;
	font-size : 20px;
	text-decoration: underline;
	font-weight: bold;
}
</style>
