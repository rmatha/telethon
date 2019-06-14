
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
					<Button text="Tester les scores" @tap="ScorePerso" />
					</StackLayout>
				</ScrollView>
				
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
	</page>
</template>

<script>
	
	export default {
		
		data() {
            return {
				scoreTestT = 0,
				scoreMoyT = 0,
				scoreTest = 0,
				scoreMoy = 0,
				testIdDefis = 0,
				  
			}
        },


		computed: {
			ScorePerso(){
				
                //alert("score equipe : "+ object.value(this.$store.state.scoresEquipe[3][3])+" id current equipe :" +this.$store.state.currentEquipe.id);
				//Essaie un deux etape:
				//Au lancement de la vue on fait la moyenne des scores totaux
				for(var i = 0; i < this.$store.state.scoresEquipe.length; i++) { //On regarde si i est un index valide
					console.log(JSON.stringify(this.$store.state.scoresEquipe[i]["score"])); //On affiche la valeur du score n°i
					scoreTestT = scoreTestT + JSON.stringify(this.$store.state.scoresEquipe[i]["score"]);//On met cette valeur dans une var
					console.log("scoreTest vaut : "+scoreTestT);//On l'affiche pour le debug
					scoreMoy = scoreTestT / i;//On fait la moyenne des scores
					console.log("scoreMoy vaut : "+scoreMoyT);//On l'affiche pour le debug

				}; 
				alert("Le score moyen est de : "+scoreMoyT);//A la fin de la boucle on affiche la moyenne finale
				
			//Gerer l'affichage par joueur

				for(var i = 0; i < this.$store.state.scoresEquipe.length; i++) {//Même procéder mais avec l'id des défis
					if ((JSON.stringify(this.$store.state.scoresEquipe[i]["idDefi"])) == testIdDefis){//On regarde on a séléctionner un défi
						//Si oui
						console.log(JSON.stringify(this.$store.state.scoresEquipe[i]["score"])+idDefi);//On affiche son score
						scoreTest = scoreTest + JSON.stringify(this.$store.state.scoresEquipe[i]["score"]);//On le met dans une variable
						console.log("scoreTest vaut : "+scoreTest);
						scoreMoy = scoreTest / i;
						console.log("scoreMoy vaut : "+scoreMoy);

					}
					console.log("Le score moyen est de : "+scoreMoy+" du défi"+idDefi);//A la fin de la boucle on affiche la moyenne finale du défis
					
					if (i == this.$store.state.scoresEquipe.length){//On regarde si la boucle est terminé 
					//Si oui on chercher les scores dans le défis au dessus
						testId++;//Contient l'idDefi actuellement scanner
					}

					else{//Si aucun des défis n'est trouvé 
						console.log("Aucun défis trouver");//Afficher aucun défi
					}

				};
				
			//Essaie en une etape:
			scoreTestT = 0;
			scoreMoyT = 0;
			scoreTest = 0;
			scoreMoy = 0;
			testIdDefis = 0;
			
				for(var i = 0; i < this.$store.state.scoresEquipe.length; i++) {//Même procéder mais avec l'id des défis
					if ((JSON.stringify(this.$store.state.scoresEquipe[i]["idDefi"])) == testIdDefis){//On regarde on a séléctionner un défi
						//Si oui
						console.log(JSON.stringify(this.$store.state.scoresEquipe[i]["score"])+idDefi);//On affiche son score
						scoreTest = scoreTest + JSON.stringify(this.$store.state.scoresEquipe[i]["score"]);//On le met dans une variable
						
						console.log("scoreTest vaut : "+scoreTest);
						scoreMoy = scoreTest / i;
						console.log("scoreMoy vaut : "+scoreMoy);

						if (i == this.$store.state.scoresEquipe.length){//On regarde si la boucle est terminé 
						//Si oui on chercher les scores dans le défis au dessus
						testId++;//Contient l'idDefi actuellement scanner
						i = 0;//On remet i à 0
						scoreTestT = scoreTest;//On prend la valeur de scoreTest pour l'ajouté dans une variable qui contieneras tout les scores
						scoreMoy = scoreTest / i ;
						console.log("Le score moyen est de : "+scoreMoy+" du défi"+idDefi);//A la fin de la boucle on affiche la moyenne finale du défis

						}

						else{//Si aucun des défis n'est trouvé 
						console.log("Aucun défis trouver");//Afficher aucun défi
						}

					}
					console.log("Le score moyen totale est de : "+scoreMoyT);//On affiche le score moyen à la fin des boucles
					
					
					

				};
			
			},

		},

		mounted() {
			
        },
		methods: {
			
		},
    }
</script>

