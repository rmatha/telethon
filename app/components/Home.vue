<template>
	<Page class="page" actionBarHidden="true">
        <DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<label class="Info-main" text="Equipe"  horizontalAlignment="center"/>
				<label class="Info-main" :text="$store.state.currentEquipe.nom"  />
				<label class="Info-main" text="Défis : "   verticalAlignment="center" horizontalAlignment="center"/>
				<label class="Info-main" :text="$store.state.currentEquipe.defis"  verticalAlignment="bottom" horizontalAlignment="center"/>
				<label class="Info-main" text="Commune : "  verticalAlignment="center" horizontalAlignment="center"/>
				<label class="Info-main" :text="$store.state.currentEquipe.commune"  /><Label :text="networkStatus" />
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
                }
				});*/
		},
        computed: {
			currentEquipe() {
				return "Equipe en cours : "+this.$store.state.currentEquipe.nom;
			},
        },
        
		methods: {
			
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
.root {
	background-color : #fbc62d;
}
</style>
