<template>
	<Page class="page" actionBarHidden="true">
        <GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3">
				<Image src="~/assets/telethon_root.png" />
				<Button text="RéinitialiserRR les tables de la base" @tap="reinit" />
				<Button text="Recharger l'équipe e cours" @tap="reinitEquipe" />
				<Button text="Recharger les scores" @tap="reinitScore" />
				<Label :text="currentEquipe" />
				<Label text="Nombre de défis en base " />
				<Label :text="$store.state.defis.length" />
				
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
    </Page>
</template>

<script>
	
	
    export default {
		mounted() {
			console.log("home !!");
			this.$store.dispatch("queryCurrentEquipe");
		},
        data() {
            return {
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
