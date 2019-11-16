<template>
    <page class="page" actionBarHidden="true">
		<DockLayout stretchLastChild="true">
        <Header dock="top" />
        <Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
				<Label :text="textCategorie " class="catTitle"/>
				
				<Label class="label" ref="labelCategorie" text="Nom de la catégorie" />
				<TextField class="textfield" hint="Ex : foot, Tennis, boxe..." v-model="categorie.nom"/>
								
					
				<Button text="Enregistrer" @tap="saveCategorie" />
			</StackLayout>
			
		</DockLayout>
	</page>
	
	
</template>

<script>
	
	import listCategorie from "./listCategorie";
	export default {
		computed: {
			textCategorie() {
				return this.$store.state.selectedCategorie ? "Edition de la catégorie "+this.$store.state.selectedCategorie.nom : "Ajout d'une catégorie";
			},
        },
        data() {
            return {
				categorie: {
					nom : ""
				},
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