<template>
	<Page class="page" actionBarHidden="true">
        <GridLayout rows="auto, *, auto" columns="*">
			<Header row="0" col="0" />
			<StackLayout row="1" col="0" >
				<Image src="~/assets/telethon_root.png" />
				<Label :text="networkStatus" />
				<button text="init monitoring reseau" @tap="monitorNetworkStart" />
				<Button text="Réinitialiser les tables de la base" @tap="reinit" />
				<Button text="Recharger l'équipe e cours" @tap="reinitEquipe" />
				<Button text="Recharger les scores" @tap="reinitScore" />
				<Label :text="currentEquipe" />
				<Label text="Nombre de défis en base " />  
				<Label :text="$store.state.defis.length" />
				
			</StackLayout>
			<Footer row="2" col="0"/>
		</GridLayout>
    </Page>
</template>

<script>
	const connectivity = require("connectivity");
    export default {
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
			}
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
