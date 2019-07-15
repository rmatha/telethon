<template>
    <page>
		<GridLayout rows="auto, *, auto" columns="*, *, *">
			<Header row="0" col="0" colSpan="3"/>
			<StackLayout row="1" col="0" colSpan="3">
					<Label :text="defiNom" />
					<Label text="Sélection du participant :" />
					<ListPicker v-if="isNouveauScore" ref="profilEnCours" :items="$store.state.profilsEquipe" textField="lastname" />
					<Label v-else :text="participant"/>
					<Label text="Score obtenu :"/>
					<ListPicker ref="scoreEnCours" :items="scoresRef" :selectedIndex="selectedIndexScore" />
					
					
				<Button text="Enregistrer" @tap="saveScore" />
			</StackLayout>
			<Footer row="2" col="0" colSpan="3"/>
		</GridLayout>
		
	</page>
	
	
</template>

<script>
	import affichageDefi from "../defi/affichageDefi";
	export default {
		computed: {
			selectedIndexScore() {
				if(this.score) {
					return this.score.score;
				}
				return 10;
			},
			participant() {
				if (this.score) {
					let profilEnCours = this.$store.state.profilsEquipe.find(e => e.id == this.score.idProfil);
					return profilEnCours.firstname+ " "+profilEnCours.lastname;

				}
				return ""
			},
			isNouveauScore() {
				return this.score == null;
			},
			defiNom() {
				return "Defi : "+this.defi.nom;
			},
			
        },
        props: ['score','categorie','defi'],
		data() {
            return {
				scoresRef: ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"],
				id : -1,
            }
        },
		mounted() {
			if (this.score) {
				this.id = this.score.id
			}
        },
		methods: {
			saveScore() {
				// récupération de l'ID du profil
				let idProfil = -1;
				if (this.score) {
					console.log("SaveScore update :");
					idProfil = this.score.idProfil;
				}
				else {
					let indexProfil = this.$refs.profilEnCours.nativeView;
					idProfil = this.$store.state.profilsEquipe[indexProfil.selectedIndex].id;
					console.log("Récupération de l'index : "+indexProfil+" : ayant pour id : "+idProfil);
				}
				let indexScore = this.$refs.scoreEnCours.nativeView;
				// récupération de l'ID du profil
				let score = this.scoresRef[indexScore.selectedIndex];
				console.log("Récupération de l'index : "+indexScore+" : ayant pour valeur : "+score);
				console.log("sauvegarde des valeurs : "+this.id+"-"+this.defi.id+"-"+idProfil+"-"+score);
				this.$store.dispatch("insertScore", {id : this.id ,idDefi : this.defi.id,idProfil : idProfil, score : score});
				this.$navigateTo(affichageDefi, { props: {defi: this.defi, categorie: this.categorie}});
            },
			
		},
    };
</script>

<style>
.catTitle {
	color : black;
	font-weight: bold;
	font-size: 30;
}
.catNBDefis {
	color : white;
	font-weight: bold;
	font-size: 15;
}

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