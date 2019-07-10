<template>
    <page>
		<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3">
				<GridLayout rows="auto" columns="*, auto">
					<Label row="0" col="0" class="titleResultat" text="Moyenne de l'équipe" />
					<Label row="0" col="1" text="Rafraichir" @tap="rafraichir" />
				</GridLayout>
				<Label  class="moyenneResultat" :text="moyenne" />
				<button text="Moyenne par défi" @tap="afficherMoyenneDefi" />
				<ListView for="moyenne in moyenneDefi">
					<v-template>
						<Label :text="textMoyenneDefi(moyenne)" />
					</v-template>
				</ListView>
				<button text="Moyenne par participant" @tap="afficherMoyenneProfil" />
				<ListView for="moyenne in moyenneProfil">
					<v-template>
						<Label :text="textMoyenneProfil(moyenne)" />
					</v-template>
				</ListView>
				
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
		
	</page>
	
	
</template>

<script>
	import affichageDefi from "../defi/affichageDefi";
	export default {
		computed: {
			
        },
        props: [],
		data() {
            return {
				moyenne : 0,
				moyenneDefi : [],
				moyenneProfil : [],
				visibleMoyenneDefi : false,
				visibleMoyenneProfil : false
            }
        },
		mounted() {
			console.log("lancement des resultats");
			this.rafraichir();
        },
		methods: {
			afficherMoyenneProfil() {
				this.visibleMoyenneProfil = !this.visibleMoyenneProfil;
			},
			afficherMoyenneDefi() {
				this.visibleMoyenneDefi = !this.visibleMoyenneDefi;
			},
			textMoyenneDefi(moyenne) {
				return "le Défi '"+moyenne.nomDefi+"' a une moyenne de "+moyenne.moyenne;
			},
			textMoyenneProfil(moyenne) {
				return "'"+moyenne.nomProfil+"' a une moyenne de "+moyenne.moyenne;
			},
			rafraichir() {
				// récupération des scores de l'équipe 
				console.log("Contenu des scores : "+JSON.stringify(this.$store.state.scoresEquipe));
				console.log("Contenu des scores : "+this.$store.state.scoresEquipe.length);
				if (this.$store.state.scoresEquipe.length == 0) {
					console.log("pas de score");
					this.moyenne = "Pas de score !";
				}
				else {
					console.log("Calcul de la moyenne");
					this.moyenne = _.meanBy(this.$store.state.scoresEquipe, 'score');
				}
				// calcul des moyennes par défi
				var scoreByDefi = _.groupBy(this.$store.state.scoresEquipe,"nomDefi");
				console.log(JSON.stringify(scoreByDefi));
				console.log("--------------------------");
				_.forEach(scoreByDefi, function(scoreTemp,nomDefi) {
					var scores = _.map(scoreTemp,"score");
					var moyenneTemp = _.meanBy(scoreTemp, 'score');
					// récupération du nom du défi 
					this.moyenneDefi.push({ nomDefi:nomDefi, moyenne : moyenneTemp});
				}.bind(this));
				// calcul des moyennes par participant
				var scoreByPart = _.groupBy(this.$store.state.scoresEquipe,"nomProfil");
				console.log(JSON.stringify(scoreByPart));
				console.log("--------------------------");
				_.forEach(scoreByPart, function(scoreTemp,nomProfil) {
					console.log("nomProfil : "+nomProfil+" enregistrements : "+JSON.stringify(scoreTemp));
					var scores = _.map(scoreTemp,"score");
					console.log("scores : "+JSON.stringify(scores));
					var moyenneTemp = _.meanBy(scoreTemp, 'score');
					console.log("moyenne : "+moyenneTemp);
					this.moyenneProfil.push({ nomProfil:nomProfil, moyenne : moyenneTemp});
				}.bind(this));
			},
			
		},
    };
</script>

<style>
.titleResultat {
	color : black;
	font-weight: bold;
	font-size: 30;
}
.moyenneResultat {
	color : black;
	font-weight: bold;
	font-size: 45;
	text-align: center;
}

</style>