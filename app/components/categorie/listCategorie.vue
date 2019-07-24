<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
			<StackLayout row="1" col="0" colSpan="3" width="100%" height="100%">
				<GridLayout rows="auto" columns="*,50">
					<Label row="0" col="0" text="Liste des catégories" class="label"/>
					<Image row="0" col="1" src="~/assets/icons/add-256.gif" @tap="addCat()"/>
					
				</GridLayout>
				<ListView for="item in $store.state.categories" height="100%" > 
				  <v-template>
					<GridLayout rows="*" columns="*" margin="0"  >
						<Image :src="lienCat(item.nom)" height="25%" @tap="selectCategorie(item)"/>
						<GridLayout verticalAlignment="bottom">
							<StackLayout paddingTop="8" paddingBottom="8" paddingLeft="16" paddingRight="16">
								<Label :text="item.nom"  />
								<Label :text="item.nom" class="catTitle" />
								<Label :text="nbDefis(item)" class="catNBDefis" />
								<Button text="modifier" v-if="$store.state.selectedEquipe.admin" @tap="addCat(item)" />
								<Button text="Supprimer" v-if="$store.state.selectedEquipe.admin" @tap="deleteCat(item)" />
							</StackLayout>
						</GridLayout>
					</GridLayout>
				  </v-template>
				</ListView>
			</StackLayout>
			</StackLayout>
		</DockLayout>
	</page>
	
</template>

<script>
	
	import addCategorie from "./addCategorie";
	import modal from "../include/modal";
	import listDefisCat from "../defi/listDefisCat";
	
	export default {
		computed: {
            lienCat() {
                return name => ("~/assets/challengeCat/" + name + ".jpg");
            },
			isAdmin(){
				if (this.$store.state.currentEquipe.admin > 1){
					return true;
				}
				return false;
			},



			
        },
        data() {
            return {
				
            }
        },
		mounted() {
			console.log("chargment de la base Categorie");
			this.$store.dispatch("queryCategorie");
            console.log("chargement dans la variable");
        },
		methods: {
			
			nbDefis(itemRef) {
				var nbDefisCat = this.$store.state.defis.filter(item => {
					return item.categorie == itemRef.id;
				});
				return "Nombre de défis : "+nbDefisCat.length;
			},
			addCat(categorie = null) {
				if (categorie) {
					console.log("Modification de la catégorie :",categorie.nom);
					this.$store.state.selectedCategorie = categorie;
					this.$navigateTo(addCategorie);
				}
				else {
					console.log("Ajout d'une catégorie");
					this.$store.state.selectedCategorie = null;
					this.$navigateTo(addCategorie);
				}
				/*if (item.defis.length > 0) {
					console.log("Affichage des défis");
					
            	}*/
			},
			deleteCat(categorie) {
				// affichage du modal de confirmation
				this.$showModal(modal, { fullscreen: true, props: { textModal: "Voulez-vous supprimer la catégorie "+categorie.nom+" ?" }}).then( data => {
					console.log(data);
					if (data) {
						console.log("on supprime !");
						this.$store.dispatch("deleteCategorie", categorie);
						this.$store.dispatch("queryCategorie");
					}
					else {
						console.log("pas touche !");
					}
				});
			},
            selectCategorie(categorie) {
				console.log("listCategorie : ouverture des defis pour la categorie : "+categorie.nom);
				this.$store.state.selectedCategorie = categorie;
				this.$navigateTo(listDefisCat);
			},
			
		},
    };
</script>

<style>
.catTitle {
	color : white;
	font-weight: bold;
	font-size: 30;
}
.catNBDefis {
	color : white;
	font-weight: bold;
	font-size: 15;
}

</style>