
<template>
    <page class="page" actionBarHidden="true">
		
	<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3" width="100%" height="100%">
				<ScrollView>
					<StackLayout class="m-20">
						<StackLayout orientation="horizontal" backgroundcolor="#fbc62d">
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
				scoreTestT : 0,
				scoreMoyT : 0,
				scoreTest : 0,
				scoreMoy : 0,
				testIdDefis : 0,
				  
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
<style scoped>
    .home-panel {
        vertical-align: center;
        font-size: 20;
        margin: 15;
    }

    .description-label {
        margin-bottom: 15;
    }
.iPhone-XXS-11 {
  width: 100%;
  height: 100%;
  background-color: #fbc62d;
margin-left: auto ;
  margin-right: auto ;
}
.Rectangle-15 {
  position: absolute;
  width: 100%;
  height: 4.35%;
  background-image: linear-gradient(to left, #7367ec, #7395ef);
  position: relative;
  display: inline-block; 
  z-index: 1;
}

.Version-2019 {
  width: auto;
  height: auto;
  margin-left: 37%;
  font-family: Montserrat;
  font-size: 14.5%;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2;
  color: #ffffff;
  z-index: 2;
}
.Info-main {
  width: auto;
  height: auto;
  font-family: Montserrat;
  font-size: 17%;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2;
  color: black;
  z-index: 2;
}
.Info-space{
  margin-left:5%;
  margin-top:50%;
}
.Ellipse-2 {
  position: absolute;
  width: 375px;
  height: 264px;
  top:-7%;
  margin-left: -2%;
  margin-bottom: 0%;
}
.Trac-1 {
  position: absolute;
  width: 375px;
  height: 264px;
  top:-6.5%;
  margin-left: -2%;
  margin-bottom: 0%;
}
.Ellipse-3 {
  position: absolute;
  width: 375px;
  height: 264px;
  top:-6%;
  margin-left: -2%;
  margin-bottom: 0%;
}
.Ellipse-4 {
  position: absolute;
  width: 375px;
  height: 218px;
  top:-5.5%;
  margin-left: -2%;
  margin-bottom: 0%;
}
.Ellipse-5 {
  position: absolute;
  width: 375px;
  height: 218px;
  top:-5%;
  margin-left: -2%;
  margin-bottom: 0%;
}
.Ellipse-6 {
  position: absolute;
  width: 375px;
  height: 218px;
  top:90%;
  margin-left: -2%;
  margin-bottom: 0%;
}
.Header {
  width: 110%;
  height:100%;
  margin-bottom: 0%;
  z-index: 0;
}
.iPhone-XXS-11 {
  position: relative;

}
.Cover{
  margin-top:50%;
  width: 100%;
  height: 60%;
  background: #fbc62d;    
  z-index: 0;
}
.Footer{
  width: 125%;
  height: 100%;
  margin-bottom: 0%;
  z-index: 2;
}
.boutonDev1{
  
  /* font */
  color: #fbc62d;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2;
  font-size: 20px;
  font-family: Montserrat;
  text-transform: capitalize;
  /* remove blue underline */
  text-decoration: none;
  font-weight: bold;
  /* border */
  border: 2% solid white;
  border-radius: 30%;
  
  /* other */
  background-color: white;
  padding: 10% 80%;  
  z-index: 2;
}
.boutonDev2{

  /* font */
  color: #fbc62d;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2;
  font-size: 20px;
  font-family: Montserrat;
  text-transform: capitalize;
  
  /* remove blue underline */
  text-decoration: none;
  
  /* border */
  border: 2% solid white;
  border-radius: 30%;
  
  /* other */
  background-color: white;
  padding: 10% 87%;   
  z-index: 2;
}
.boutonDev3{

  /* font */
  color: #fbc62d;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2;
  font-size: 20px;
  font-family: Montserrat;
  text-transform: capitalize;
  
  /* remove blue underline */
  text-decoration: none;
  
  /* border */
  border: 2% solid white;
  border-radius: 30%;
  
  /* other */
  background-color: white;
  padding: 10% 84%;   
  z-index: 2;
}
.boutonDer1{

  
  /* remove blue underline */
  text-decoration: none;
  font-size: 22.5px;
  /* border */
    border-style: solid;
  border-width: 5px;
  border-color: white;
  border-radius: 30%;
  
  /* other */
  background-color: #fbc62d;
 padding: 7.4% 80%; 
  z-index: 1;
}
.boutonDer2{

  
 /* remove blue underline */
 text-decoration: none;
  font-size: 22.5px;
  /* border */
    border-style: solid;
  border-width: 5px;
  border-color: white;
  border-radius: 30%;
  
  /* other */
  background-color: #fbc62d;
 padding: 7.2% 80%; 
  z-index: 1;
}
.boutonDer3{

 /* remove blue underline */
 text-decoration: none;
  font-size: 22.5px;
  /* border */
    border-style: solid;
  border-width: 5px;
  border-color: white;
  border-radius: 30%;
  
  /* other */
  background-color: #fbc62d;
 padding: 7.2% 80%; 
  z-index: 1;
}
.textMenu{
  position:absolute;
  top:62.5%;
  left:36%;
  
  /* font */
  color: #7B7A78;
  text-decoration: underline;
  font-weight: bold;
  font-size: 20px;
  font-family: montserrat; 
  z-index: 2;
}
.IconTeam{
  padding:10%;
  width: 8%;
  height:8%;
  z-index:4;
}
.IconDefis{
  padding:10%;
  width: 8%;
  height:8%;; 
  z-index:4;
}
.IconScore{
  padding:10%;
  width: 8%;
  height:8%;; 
  z-index:4;
}
</style>

