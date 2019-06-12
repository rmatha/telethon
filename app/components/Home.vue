<template>
	<Page class="page" actionBarHidden="true">
        <GridLayout rows="auto, *, auto" columns="*">
			<Header row="0" col="0" />
			<StackLayout row="1" col="0" >
				<Image src="~/assets/telethon_root.png" />
<<<<<<< HEAD
				<Label :text="networkStatus" />
				<Button text="Réinitialiser les tables de la base" @tap="reinit" />
=======
				<Button text="RéinitialiserRR les tables de la base" @tap="reinit" />
>>>>>>> 6c197d986e9f966a8b2fc4bde4bb81a5b1df0846
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
	
	
    export default {
		mounted() {
			console.log("home !!");
			this.$store.dispatch("queryCurrentEquipe");
		// vérification de la connectivité
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
        data() {
            return {
				networkStatus : "",
            };
        },
        computed: {
			currentEquipe() {
				return "Equipe en cours : "+this.$store.state.currentEquipe.nom;
			}
        },
        
		methods: {
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
