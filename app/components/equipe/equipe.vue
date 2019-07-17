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
					<Label class="label" text="Commune des défis Téléthon" />
					<Label class="valeur" :text="$store.state.currentEquipe.commune" />

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
</style>