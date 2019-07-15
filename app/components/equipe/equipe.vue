<template>
	<page class="page" actionBarHidden="true">
		<GridLayout rows="auto, *, auto" columns="*">
			<Header row="0" col="0" />
			<ScrollView row="1" col="0" >
				<StackLayout class="m-20">
					<GridLayout rows="200" columns="*" >
						<Image row="0" col="0" v-if="imageSrc" :src="imageSrc" class="imageEquipe" @tap="takePicture"></Image>
						<Label  row="0" col="0" v-else text="Appuyer pour changer votre image d'équipe" @tap="takePicture" />
					</GridLayout>
					<StackLayout orientation="horizontal" >
						<Label width="90%" class="m-b-20 titreTelethon" :text="titreEquipe" textWrap="true" />
						<Image width="10%" src="~/assets/icons/change.png" @tap="changeEquipe"/>
					</StackLayout>
					<Label text="Commune des défis Téléthon" />
					<Label :text="$store.state.currentEquipe.commune" />

					<Label text="Votre équipe est Organisateur" v-if="isOrganisateur"  />
					<Label text="Votre équipe est Coordinateur " v-if="isCoordinateur" />

					
					<StackLayout orientation="horizontal" >
						
						<Label width="85%" class="m-b-20" text="Liste des participants de l'équipe" textWrap="true" />
						<Image width="15%" src="~/assets/icons/add-256.gif" @tap="addParticipant"/>
						
					</StackLayout>
					<Button text="test" @tap="gotest" />
					<ScrollView >
						<StackLayout >
							<GridLayout v-for="participant in $store.state.profilsEquipe" rows="40" columns="*"  >
								<Label :text="libelleProfil(participant)" class="labelVille" @tap="editParticipant(participant)"/>
							</GridLayout>
						</StackLayout>
						
					</ScrollView>
					
				</StackLayout>
				
			</ScrollView>
			
			<Footer row="2" col="0" />
		</GridLayout>
		
	</page>
</template>

 
<script>

	import profil from "./profil";
	import changeEquipe from "./changeEquipe";
	import { Image } from "tns-core-modules/ui/image";
	import * as camera from "nativescript-camera";
	import store from "../store/teleStore.js";
	const imageSourceModule = require("tns-core-modules/image-source");
	const fileSystemModule = require("tns-core-modules/file-system");
	import test from "./test";
	
    export default {
        mounted() {
			console.log(this.EtatAdmin);
			console.log("Le flag est passé dans le mounted de equipe");
			
			console.log("Admin est à :"+this.$store.state.currentEquipe.admin)


        },
		computed: {			
			titreEquipe() {
				if (this.$store.state.currentEquipe.nom.length > 0) {
					return this.$store.state.currentEquipe.nom;
				}
				return "Pas d'équipe en cours";
			},
			isOrganisateur(){
						if (this.$store.state.currentEquipe.admin == 1){
							console.log("vous etes organisateur") 
							return true;
						};
					
				return false;
			},
			isCoordinateur(){
				if (this.$store.state.currentEquipe.admin == 2 ){
					console.log("vous etes Coordinateur") 
					return true;
				};
					
				return false;
			}
        },

	

		data() {
            return {
				imageSrc : null,
				LibelleAdmin : 0,
            };
        },
		
        methods: {
			takePicture: function() {
			  // TEST
			  camera.requestPermissions();
			  camera
				.takePicture({ width: 700, height: 700, keepAspectRatio: true })
				.then(
				  imageAsset => {
					console.log("Result is an image asset instance");
					this.imageSrc = imageAsset;
					const source = new imageSourceModule.ImageSource();
					source.fromAsset(imageAsset).then(imageSource => {
						const folder = fileSystemModule.knownFolders.documents().path;
						console.log("folder : "+folder);
						const fileName = "picture.png";
						const path = fileSystemModule.path.join(folder,fileName);
						const picsaved = imageSource.saveToFile(path, "png");

						if (picsaved) {
							console.log("Saved");
						}
						else {
							console.log("picture NOT saved");
						}
					});
				  },
				  error => console.log(error)
				)
				.catch(err => {
				  console.log("Error -> " + err.message);
				});
			},
			libelleProfil(participantTemp) {
				return participantTemp.firstname +" " +participantTemp.lastname;
			},
			addParticipant(participantTemp) {
				console.log("Ajout d'un aprticipant :"+participantTemp);
				this.$navigateTo(profil, { props: {participant : null}});
			},
			editParticipant(participantTemp) {
				console.log("Ajout d'un aprticipant :"+participantTemp);
				this.$navigateTo(profil, { props: {participant : participantTemp}});
			},
			
			changeEquipe() {
				console.log("on change d'équipe");
				this.$navigateTo(changeEquipe);
			},


			gotest() {
				console.log("test");
				this.$navigateTo(test);
			},
			
			
            
        }
    };
</script>

<style>
.labelVille {
	color : #000000;
}
.titreTelethon {
	font-size : 38px;
}
.red {
	color: #ff0000;
}

.green {
	color : #00ff00;
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