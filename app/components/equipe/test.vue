
<template>
    <page class="page" actionBarHidden="true">
	<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3" width="100%" height="100%">
				<ScrollView>
					<StackLayout class="m-20">
						<StackLayout orientation="horizontal" backgroundcolor="#562389">
						<Label text="Resultats!" />
						
						</StackLayout>
					
					</StackLayout>
				</ScrollView>
				
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
	</page>
</template>

<script>
	
	export default {
		
		computed: {
			
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
					var idDefi = 0;
					

					for(var i = 0; i < this.$store.state.scoresEquipe.length; i++) { //On regarde si i est un index valide
						var idDefiT = parseInt(JSON.stringify(this.$store.state.scoresEquipe[i]["idDefi"]),10);
						var scoreTest = parseInt(JSON.stringify(this.$store.state.scoresEquipe[i]["score"]),10);
						var idDefiProfil = parseInt(JSON.stringify(this.$store.state.scoresEquipe[i]["idDefiProfil"]),10);
						console.log("Id defi en Integepgpegpaegpr : "+idDefi);
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
			},
    };
</script>

