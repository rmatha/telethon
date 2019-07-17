<template>
    <page>
		<DockLayout stretchLastChild="true">
			<Header dock="top" />
			<Footer dock="bottom" />
			<StackLayout dock="center" class="root" >
			<StackLayout row="1" col="0" colSpan="3">
					<Label row="0" col="0" text="Edition Catégorie " class="catTitle"/>
					
					
				<Label :text="categorie.id" />
				<FloatLabel placeholder="Nom de la catégorie" label="Nom" :valeur="categorie.nom" @updateValeur="updateCatNom"/>
						
					
				<Button text="Enregistrer" @tap="saveCategorie" />
			</StackLayout>
			</StackLayout>
		</DockLayout>
	</page>
	
	
</template>

<script>
	
	import listCategorie from "./listCategorie";
	export default {
		computed: {
			
			myCategorieName() {
                return "Tennis";
            },
        },
        props: ['cat'],
		data() {
            return {
				categorie: {
					id : 0,
					nom : ""
				},
            }
        },
		mounted() {
			console.log("Edition de la categorie");
			if (this.cat) {
				console.log("Chargement de cat");
				this.categorie = this.cat;
			}
			else {
				console.log("on conserve la catégorie vide");
			};
			
        },
		methods: {
			saveCategorie() {
				console.log("on sauvegarde la catégorie : "+this.categorie.id +" : "+this.categorie.nom);
			    this.$store.dispatch("insertCategorie", this.categorie);
				this.$navigateTo(listCategorie);
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