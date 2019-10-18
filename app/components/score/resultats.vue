<template>
    <Page class="page" actionBarHidden="true">
	  <DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
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
		</StackLayout>
		</DockLayout>
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
				// reinitialisation de la moyenne
				this.moyenneProfil = [];
				this.moyenneDefi = [];
				// récupération des scores de l'équipe 
				console.log("Contenu des scores : "+JSON.stringify(this.$store.state.selectedEquipe.scores));
				console.log("Contenu des scores : "+this.$store.state.selectedEquipe.scores.length);
				if (this.$store.state.selectedEquipe.scores.length == 0) {
					console.log("pas de score");
					this.moyenne = "Pas de score !";
				}
				else {
					console.log("Calcul de la moyenne : "+JSON.stringify(this.$store.state.selectedEquipe.scores));
					this.moyenne = _.round(_.meanBy(this.$store.state.selectedEquipe.scores, 'score'),2);
				}
				// calcul des moyennes par défi
				var scoreByDefi = _.groupBy(this.$store.state.selectedEquipe.scores,"defi.nom");
				console.log(JSON.stringify(scoreByDefi));
				console.log("--------------------------");
				_.forEach(scoreByDefi, function(scoreTemp,nomDefi) {
					console.log("RESULTAT : scoreByDefi : "+JSON.stringify(scoreTemp));
					console.log("RESULTAT : nomDefi : "+nomDefi);
					var scores = _.round(_.map(scoreTemp,"score"),2);
					var moyenneTemp = _.round(_.meanBy(scoreTemp, 'score'),2);
					// récupération du nom du défi 
					this.moyenneDefi.push({ nomDefi: nomDefi, moyenne : moyenneTemp});
				}.bind(this));
				// calcul des moyennes par participant
				var scoreByPart = _.groupBy(this.$store.state.selectedEquipe.scores,"participant.nom");
				console.log(JSON.stringify(scoreByPart));
				console.log("--------------------------");
				_.forEach(scoreByPart, function(scoreTemp,participant) {
					console.log("participant : "+participant.nom+" enregistrements : "+JSON.stringify(scoreTemp));
					var scores = _.round(_.map(scoreTemp,"score"),2);
					console.log("scores : "+JSON.stringify(scores));
					var moyenneTemp = _.round(_.meanBy(scoreTemp, 'score'),2);
					console.log("moyenne : "+moyenneTemp);
					this.moyenneProfil.push({ nomProfil:participant, moyenne : moyenneTemp});
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