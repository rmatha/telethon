<template>
	<page class="page" actionBarHidden="true">
		  <DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
			<ScrollView row="1" col="0" >
				<StackLayout class="m-20">
					<!--<GridLayout rows="200" columns="*" >
						<Image row="0" col="0" v-if="imageSrc" :src="imageSrc" class="imageEquipe" @tap="takePicture"></Image>
						<Label  row="0" col="0" v-else text="Appuyer pour changer votre image d'équipe" @tap="takePicture" />
					</GridLayout>-->
					<StackLayout v-if="$store.state.selectedEquipe" >
						<GridLayout rows="auto" columns="*,50" >
							<Label row="0" col="0" class="m-b-20 titreTelethon" :text="titreEquipe" textWrap="true" />
							<Image row="0" col="1" class="actionButton" src="~/assets/icons/change.png" @tap="changeEquipe"/>
						</GridLayout>
						<Label text="Votre équipe est Organisateur" v-if="$store.state.selectedEquipe.organisateur"  />
						<Label text="Votre équipe est Coordinateur " v-if="$store.state.selectedEquipe.admin" />
						<Label class="label" text="Commune des défis Téléthon" />
						<Label class="valeur" :text="$store.state.selectedEquipe.commune" />

						
					</StackLayout>
					<StackLayout v-else>
						<button text="créer ou sélectionner son equipe" @tap="changeEquipe" />
					</StackLayout>

					
					<StackLayout  v-if="$store.state.selectedEquipe">
						<GridLayout rows="auto" columns="*,50" >
							<Label row="0" col="0" class="label" text="Liste des participants de l'équipe" textWrap="true" />
							<Image row="0" col="1" src="~/assets/icons/add-256.gif" @tap="addParticipant"/>
						</GridLayout>
						
						
					</StackLayout>
					<ScrollView v-if="$store.state.selectedEquipe">
						<StackLayout >
							<GridLayout v-for="participant in $store.state.profilsEquipe" rows="40" columns="*"  >
								<Label :text="libelleProfil(participant)" class="valeur" @tap="editParticipant(participant)"/>
							</GridLayout>
						</StackLayout>
					</ScrollView>
					
					
					
				</StackLayout>
				
			</ScrollView>
			</StackLayout>
	</DockLayout>
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
			console.log("Equipe en cours est à :"+JSON.stringify(this.$store.state.selectedEquipe));
			console.log("Liste des participants : "+JSON.stringify(this.$store.state.profilsEquipe));
			console.log("nombre des participants : "+this.$store.state.profilsEquipe.lenght);


        },
		computed: {			
			titreEquipe() {
				var reponse = this.$store.state.selectedEquipe ? this.$store.state.selectedEquipe.nom : "Pas d'équipe  sélectionnée";
				return reponse;
			},
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
	color : black;
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


</style>