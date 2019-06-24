
<template>
    <page class="page" actionBarHidden="true">
	<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3" width="100%" height="100%">
				<ScrollView>
				<StackLayout>
				<Label class="info" horizontalAlignment="center" verticalAlignment="center">
					<FormattedString>
						<Span class="fa" text.decode="&#xf135; "/>
						<Span :text="messageAffichage"/>
					</FormattedString>
				</Label>
				<li>
				<button text="charger mon tableau" @tap="charger" />
				<button text="groupir mon tableau" @tap="groupir" />
				<button text="moyenne de l'équipe" @tap="charger" />
				<ListView for="moyenne in moyenneDefi" @tap="ScorePerso">
					<v-template>
						<Label :text="affichageMoyenneDefi(moyenne)" />
					</v-template>
				</ListView>
				<ListView for="moyenne in moyenneProfil">
					<v-template>
						<Label :text="affichageMoyenneProfil(moyenne)" />
					</v-template>
				</ListView>
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
	</page>
</template>

<script>
	
	export default {
		
		data() {
            return {
				scoreEquipe : [],
				message : "Lancement de l'application",
				moyenneDefi : [],
				moyenneProfil : [],
            };
        },

		computed: {
          messageAffichage() {
                return this.message;
            },	
		},
        data() {
            return {
				scoreTestT : 0,
				scoreMoyT : 0,
				scoreTest : 0,
				scoreMoy : 0,
				testIdDefis : 0,
				  
			}
        },
		mounted() {
			
		},
			
		methods: {
			ScorePerso(){
				
                
					var scoreMoyT = 0;
					var scoreTestT = 0;
					var idDefi = 1;
					

					for(var i = 0; i < this.$store.state.scoresEquipe.length; i++) { //On regarde si i est un index valide
						var idDefiT = parseInt(JSON.stringify(this.$store.state.scoresEquipe[i]["idDefi"]),10);
						var scoreTest = parseInt(JSON.stringify(this.$store.state.scoresEquipe[i]["score"]),10);
						var idDefiProfil = parseInt(JSON.stringify(this.$store.state.scoresEquipe[i]["idDefiProfil"]),10);
						console.log("Id defi en Integer : "+idDefi);
						console.log("Id defi en String : "+JSON.stringify(this.$store.state.scoresEquipe[i]["idDefi"])); 
						console.log("Score en String : "+JSON.stringify(this.$store.state.scoresEquipe[i]["score"])); //On affiche la valeur du score n°i
						console.log("Score en integer : "+parseInt(JSON.stringify(this.$store.state.scoresEquipe[i]["score"]),10));
						console.log(parseInt(JSON.stringify(this.$store.state.scoresEquipe[i]["score"]),10) + parseInt(JSON.stringify(this.$store.state.scoresEquipe[i]["score"]),10));
						this.scoreTestT = this.scoreTestT + parseInt(JSON.stringify(this.$store.state.scoresEquipe[i]["score"]),10);//On met cette valeur dans une var
						console.log("scoreTestT vaut : "+this.scoreTestT);//On l'affiche pour le debug
					
							i++;
							this.scoreMoyT = this.scoreTestT/i;
							i--;
							console.log("scoreMoyT vaut : "+this.scoreMoyT);
						//if (_.isEmpty(this.byDefi[idDefiT].push({idJoueur: this.idDefiProfil, score: this.scoreTest}))){
						//	this.byDefi[idDefiT] = [];
						//}
						//this.byDefi[idDefiT].push({idJoueur: this.idDefiProfil, score: this.scoreTest});
						//console.log(byDefi[[]]);
						
					}
				},
				affichageMoyenneDefi(moyenne) {
				return "le Défi "+moyenne.idDefi+" a une moyenne de "+moyenne.moyenne;
			},
			affichageMoyenneProfil(moyenne) {
				return "le Participant "+moyenne.idProfil+" a une moyenne de "+moyenne.moyenne;
			},
			charger() {
				console.log("Lancement du chargement du tableau");
			//	console.log(this.$_.random(20));
			//	this.scoreEquipe = [];
			//	this.scoreEquipe.push({id : 0,idDefi : 0,idProfil : 0 ,score : 7});
			//	this.scoreEquipe.push({id : 1,idDefi : 1,idProfil : 1 ,score : 20});
			//	this.scoreEquipe.push({id : 2,idDefi : 3,idProfil : 0 ,score : 9});
			//	this.scoreEquipe.push({id : 3,idDefi : 2,idProfil : 1 ,score : 15});
			//	this.scoreEquipe.push({id : 4,idDefi : 2,idProfil : 0 ,score : 10});
			//	this.scoreEquipe.push({id : 5,idDefi : 1,idProfil : 1 ,score : 11});
			//	this.scoreEquipe.push({id : 6,idDefi : 0,idProfil : 0 ,score : 18});
				this.message = "Taille de mon tableau : "+this.scoreEquipe.length;
			},
			groupir() {
				this.message = "";
				// on gére pour les moyennes par défis
				var scoreByDefi = _.groupBy(this.$store.state.scoresEquipe,"idDefi");
				console.log(JSON.stringify(scoreByDefi));
				console.log("--------------------------");
				_.forEach(scoreByDefi, function(scoreTemp,idDefi) {
					console.log("idDefi : "+idDefi+" enregistrements : "+JSON.stringify(scoreTemp));
					var scores = _.map(scoreTemp,"score");
					console.log("scores : "+JSON.stringify(scores));
					var moyenne = _.meanBy(scoreTemp, 'score');
					console.log("moyenne : "+moyenne);
					this.moyenneDefi.push({ idDefi:idDefi, moyenne : moyenne});
				}.bind(this));
				// on gére pour les moyennes par participant
				var scoreByProfil = _.groupBy(this.$store.state.scoresEquipe,"idProfil");
				console.log(JSON.stringify(scoreByProfil));
				console.log("--------------------------");
				_.forEach(scoreByProfil, function(scoreTemp,idProfil) {
					console.log("idProfil : "+idProfil+" enregistrements : "+JSON.stringify(scoreTemp));
					var scores = _.map(scoreTemp,"score");
					console.log("scores : "+JSON.stringify(scores));
					var moyenne = _.meanBy(scoreTemp, 'score');
					console.log("moyenne : "+moyenne);
					this.moyenneProfil.push({ idProfil:idProfil, moyenne : moyenne});
				}.bind(this));
			},
		},
    };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '../app-variables';
    // End custom common variables

    // Custom styles
    .fa {
        color: $accent-dark;
    }

    .info {
        font-size: 20;
    }
</style>

