<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<Label :text="textCategorie " class="catTitle"/>
				
				<Label class="label" ref="labelCategorie" text="Nom de la catégorie" />
				<TextField class="textfield" hint="Ex : foot, Tennis, boxe..." v-model="categorie.nom"/>
				<Button text="Take Picture" @tap="takePicture" />
				<Button text="Choose Picture" @tap="selectPicture" />
				<WrapLayout>
					<Image v-for="img in images" :src="img.src" width="75" height="75" />
				</WrapLayout>				
					
				<Button text="Enregistrer" @tap="saveCategorie" />
			</StackLayout>
			
		</DockLayout>
	</page>
	
	
</template>

<script>
	
	import listCategorie from "./listCategorie";
	import * as camera from "nativescript-camera";
	import * as imagepicker from "nativescript-imagepicker";

	import { Image } from "tns-core-modules/ui/image";
	
	export default {
		computed: {
			textCategorie() {
				return this.$store.state.selectedCategorie ? "Edition de la catégorie "+this.$store.state.selectedCategorie.nom : "Ajout d'une catégorie";
			},
        },
        data() {
            return {
				categorie: {
					nom : "",
					
				},
				images : [],
            }
        },
		mounted() {
			//console.log("Edition de la categorie");
			if (this.$store.state.selectedCategorie) {
				//console.log("Chargement de cat");
				this.categorie = this.$store.state.selectedCategorie;
			};
			
        },
		methods: {
			selectPicture() {

				let context = imagepicker.create({
					mode: 'multiple' 
				});

				context.authorize()
				.then(function() {
					return context.present();
				})
				.then(selection => {
					selection.forEach(selected => {
						
						console.log(JSON.stringify(selected));

						let img = new Image();
						img.src = selected;
						this.images.push(img);
					});
				}).catch(function (e) {
					console.log('error in selectPicture', e);
				});

			},
			takePicture() {
				camera.requestPermissions()
				.then(() => {
					camera.takePicture({ width: 300, height: 300, keepAspectRatio: true, saveToGallery:false })
					.then(imageAsset => {
						let img = new Image();
						img.src = imageAsset;
						this.images.push(img);
						console.log('ive got '+this.images.length+' images now.');
					})
					.catch(e => {
						console.log('error:', e);
					});
				})
				.catch(e => {
					console.log('Error requesting permission');
				});
			},
			saveCategorie() {
				if (this.$store.state.selectedCategorie) {
					//console.log("on update la catégorie : "+this.categorie.nom);
					this.$store.dispatch("updateCategorie", {"categorie" : this.categorie});
					this.$store.state.updateCategorie = true;
					this.$navigateTo(listCategorie);
				}
				else {
					//console.log("on ajoute la catégorie : "+this.categorie.nom);
					this.$store.dispatch("addCategorie", {"categorie" : this.categorie});
					this.$store.state.updateCategorie = true;
					this.$navigateTo(listCategorie);
				}
            },
			updateCatNom(catName) {
				this.categorie.nom = catName;
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

</style>